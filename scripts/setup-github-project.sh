#!/usr/bin/env bash
set -euo pipefail

# Create a user-owned GitHub Project for Jobvana engineering work.
+#
+# Requirements:
+#   - GitHub CLI (`gh`)
+#   - authentication with the `project` scope
+#
+# Optional environment variables:
+#   OWNER=vbeffa
+#   REPO=vbeffa/jobvana
+#   PROJECT_TITLE=Jobvana
+
+OWNER="${OWNER:-vbeffa}"
+REPO="${REPO:-vbeffa/jobvana}"
+FULL_REPO="$REPO"
+PROJECT_TITLE="${PROJECT_TITLE:-Jobvana}"
+API_VERSION="2026-03-10"

# Jobvana-specific project taxonomy.
PRIORITY_HIGH=(11 12 21 24 45 46)
PRIORITY_MEDIUM=(25 29 32 35 50)
PRIORITY_LOW=(28 30 37)

AREA_SECURITY=(11)
AREA_DATA=(12 21 24 32 45 46)
AREA_BACKEND=(25)
AREA_FRONTEND=(28 29 30 50)
AREA_INFRASTRUCTURE=(35 37)
AREA_DOCUMENTATION=()

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "error: required command not found: $1" >&2
    exit 1
  }
}

need gh

echo "Checking GitHub authentication..."
gh auth status >/dev/null
gh repo view "$FULL_REPO" >/dev/null
if ! gh project list --owner "$OWNER" --limit 1 >/dev/null 2>&1; then
  echo "error: GitHub CLI authentication does not appear to have project access" >&2
  echo "run: gh auth refresh -s project" >&2
  exit 1
fi

EXISTING_PROJECT_NUMBER="$(
  gh api graphql \
    -f query='query($login: String!) {
      user(login: $login) {
        projectsV2(first: 100) { nodes { number title closed } }
      }
    }' \
    -f login="$OWNER" \
    --jq ".data.user.projectsV2.nodes[] | select(.title==\"$PROJECT_TITLE\" and .closed==false) | .number" |
    head -n 1
)"

if [[ -n "$EXISTING_PROJECT_NUMBER" ]]; then
  echo "error: an open '$PROJECT_TITLE' project already exists as #$EXISTING_PROJECT_NUMBER" >&2
  echo "refusing to create a duplicate" >&2
  exit 1
fi

echo "Creating GitHub Project: $PROJECT_TITLE"
PROJECT_NUMBER="$(
  gh project create \
    --owner "$OWNER" \
    --title "$PROJECT_TITLE" \
    --format json \
    --jq '.number'
)"
PROJECT_URL="https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"

echo "Created project #$PROJECT_NUMBER: $PROJECT_URL"

echo "Linking project to $FULL_REPO..."
gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$FULL_REPO"

echo "Creating Priority and Area fields..."
gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Priority" \
  --data-type SINGLE_SELECT \
  --single-select-options "High,Medium,Low" >/dev/null

gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Area" \
  --data-type SINGLE_SELECT \
  --single-select-options "Data,Backend,Frontend,Infrastructure,Security,Documentation" >/dev/null

echo "Configuring Status options..."
STATUS_FIELD_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Status") | .id'
)"
TODO_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Status") | .options[] | select(.name=="Todo") | .id'
)"
IN_PROGRESS_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Status") | .options[] | select(.name=="In Progress") | .id'
)"
DONE_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Status") | .options[] | select(.name=="Done") | .id'
)"

if [[ -z "$STATUS_FIELD_ID" || -z "$TODO_ID" || -z "$IN_PROGRESS_ID" || -z "$DONE_ID" ]]; then
  echo "error: could not identify the default Status field/options" >&2
  exit 1
fi

gh api graphql -f query="
mutation {
  updateProjectV2Field(input: {
    fieldId: \"$STATUS_FIELD_ID\"
    singleSelectOptions: [
      {id: \"$TODO_ID\",        name: \"Backlog\",     color: GRAY,   description: \"Not yet ready to start\"}
      {                         name: \"Ready\",       color: BLUE,   description: \"Ready to work on\"}
      {id: \"$IN_PROGRESS_ID\", name: \"In progress\", color: YELLOW, description: \"Currently being worked on\"}
      {                         name: \"In review\",   color: PURPLE, description: \"Awaiting review or merge\"}
      {id: \"$DONE_ID\",        name: \"Done\",        color: GREEN,  description: \"Completed\"}
    ]
  }) {
    projectV2Field {
      ... on ProjectV2SingleSelectField {
        name
        options { id name }
      }
    }
  }
}" >/dev/null

echo "Importing open issues from $FULL_REPO..."
gh issue list -R "$FULL_REPO" --state open --limit 500 --json url --jq '.[].url' |
while read -r url; do
  [[ -n "$url" ]] || continue
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$url" >/dev/null
  echo "  added $url"
done

set_issue_field() {
  local issue_number="$1"
  local field="$2"
  local value="$3"
  local state

  state="$(gh issue view "$issue_number" -R "$FULL_REPO" --json state --jq '.state')"
  if [[ "$state" != "OPEN" ]]; then
    echo "  skipping closed issue #$issue_number ($field=$value)"
    return 0
  fi

  gh project item-edit "$PROJECT_NUMBER" \
    --owner "$OWNER" \
    --url "https://github.com/$FULL_REPO/issues/$issue_number" \
    --field "$field" \
    --value "$value" >/dev/null
}

set_many() {
  local field="$1"
  local value="$2"
  shift 2
  local n
  for n in "$@"; do
    set_issue_field "$n" "$field" "$value"
  done
}

echo "Assigning priorities..."
set_many "Priority" "High"   "${PRIORITY_HIGH[@]}"
set_many "Priority" "Medium" "${PRIORITY_MEDIUM[@]}"
set_many "Priority" "Low"    "${PRIORITY_LOW[@]}"

echo "Assigning areas..."
set_many "Area" "Security"       "${AREA_SECURITY[@]}"
set_many "Area" "Data"           "${AREA_DATA[@]}"
set_many "Area" "Backend"        "${AREA_BACKEND[@]}"
set_many "Area" "Frontend"       "${AREA_FRONTEND[@]}"
set_many "Area" "Infrastructure" "${AREA_INFRASTRUCTURE[@]}"
if ((${#AREA_DOCUMENTATION[@]})); then
  set_many "Area" "Documentation" "${AREA_DOCUMENTATION[@]}"
fi

# If issue #45 still has its implementation PR (#47) open, reflect that in the board.
if [[ "$(gh issue view 45 -R "$FULL_REPO" --json state --jq '.state')" == "OPEN" ]] && \
   [[ "$(gh pr view 47 -R "$FULL_REPO" --json state --jq '.state' 2>/dev/null || true)" == "OPEN" ]]; then
  echo "Marking issue #45 In review..."
  set_issue_field 45 "Status" "In review"
fi

echo "Configuring the default table view..."
TITLE_FIELD_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Title") | .id'
)"
PRIORITY_FIELD_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Priority") | .id'
)"
AREA_FIELD_ID="$(
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq '.fields[] | select(.name=="Area") | .id'
)"

BACKLOG_VIEW_ID="$(
  gh api graphql \
    -f query='query($login: String!, $number: Int!) {
      user(login: $login) {
        projectV2(number: $number) {
          views(first: 20) { nodes { id name layout } }
        }
      }
    }' \
    -f login="$OWNER" \
    -F number="$PROJECT_NUMBER" \
    --jq '.data.user.projectV2.views.nodes[] | select(.layout=="TABLE_LAYOUT") | .id' |
    head -n 1
)"

if [[ -z "$BACKLOG_VIEW_ID" ]]; then
  echo "error: could not locate the default table view" >&2
  exit 1
fi

gh api graphql -f query="
mutation {
  updateProjectV2View(input: {
    viewId: \"$BACKLOG_VIEW_ID\"
    name: \"Backlog\"
    configuration: {
      visibleFieldIds: [
        \"$TITLE_FIELD_ID\"
        \"$STATUS_FIELD_ID\"
        \"$PRIORITY_FIELD_ID\"
        \"$AREA_FIELD_ID\"
      ]
    }
  }) {
    projectV2View { id name layout }
  }
}" >/dev/null

echo "Creating Workflow board..."
TITLE_REST_ID="$(
  gh api -H "X-GitHub-Api-Version: $API_VERSION" \
    "/users/$OWNER/projectsV2/$PROJECT_NUMBER/fields" \
    --jq '.[] | select(.name=="Title") | .id'
)"
STATUS_REST_ID="$(
  gh api -H "X-GitHub-Api-Version: $API_VERSION" \
    "/users/$OWNER/projectsV2/$PROJECT_NUMBER/fields" \
    --jq '.[] | select(.name=="Status") | .id'
)"
PRIORITY_REST_ID="$(
  gh api -H "X-GitHub-Api-Version: $API_VERSION" \
    "/users/$OWNER/projectsV2/$PROJECT_NUMBER/fields" \
    --jq '.[] | select(.name=="Priority") | .id'
)"
AREA_REST_ID="$(
  gh api -H "X-GitHub-Api-Version: $API_VERSION" \
    "/users/$OWNER/projectsV2/$PROJECT_NUMBER/fields" \
    --jq '.[] | select(.name=="Area") | .id'
)"

WORKFLOW_URL="$(
  gh api -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: $API_VERSION" \
    "/users/$OWNER/projectsV2/$PROJECT_NUMBER/views" \
    -f name="Workflow" \
    -f layout="board" \
    -f filter="is:open" \
    -F "visible_fields[]=$TITLE_REST_ID" \
    -F "visible_fields[]=$PRIORITY_REST_ID" \
    -F "visible_fields[]=$AREA_REST_ID" \
    -F "vertical_group_by[]=$STATUS_REST_ID" \
    --jq '.html_url'
)"

echo
echo "Project setup complete."
echo "Project:  $PROJECT_URL"
echo "Workflow: $WORKFLOW_URL"
echo
echo "One manual step remains:"
echo "  Project -> ... -> Workflows -> Auto-add to project -> Edit"
echo "  Repository: $FULL_REPO"
echo "  Filter:     is:issue is:open"
echo "  Then choose: Save and turn on workflow"
echo
echo "Current project items:"
gh project item-list "$PROJECT_NUMBER" --owner "$OWNER" \
  --limit 200 \
  --field Status --field Priority --field Area
