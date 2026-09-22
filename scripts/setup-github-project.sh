#!/usr/bin/env bash
set -euo pipefail

OWNER="vbeffa"
REPO="jobvana"
FULL_REPO="$OWNER/$REPO"
PROJECT_TITLE="Jobvana"
API_VERSION="2026-03-10"

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
gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$REPO"

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

b| ÖÈ^ÕUT×ÑQSÒQ^Ñ×ÒQ^SÔÑÔTÔ×ÒQ^ÓWÒQWNÈ[XÚÈ\ÜÛÝ[ÝY[YHHY][Ý]\ÈY[ÛÜ[ÛÈ^]BBÚ\HÜ\[Y]Y\OH]]][ÛÂ\]TÚXÝY[
[]ÂY[YÕUT×ÑQSÒQÚ[ÛTÙ[XÝÜ[ÛÎÂÚYÑ×ÒQ[YNXÚÛÙ×ÛÛÜÔVK\ØÜ\[ÛÝY]XYHÈÝ\BÈ[YNXYWÛÛÜQK\ØÜ\[ÛXYHÈÛÜÈÛBÚYSÔÑÔTÔ×ÒQ[YN[ÙÜ\Ü×ÛÛÜQSÕË\ØÜ\[ÛÝ\[HZ[ÈÛÜÙYÛBÈ[YN[]Y]×ÛÛÜTK\ØÜ\[Û]ØZ][È]Y]ÈÜY\ÙWBÚYÓWÒQ[YNÛWÛÛÜÔQS\ØÜ\[ÛÛÛ\]YBBJHÂÚXÝY[ÂÛÚXÝÚ[ÛTÙ[XÝY[Â[YBÜ[ÛÈÈY[YHBBBBHÙ]Û[XÚÈ[\Ü[ÈÜ[\ÜÝY\ÈÛH	SÔTËÚ\ÜÝYH\ÝTSÔTÈK\Ý]HÜ[K[[Z]LKZÛÛ\KZH	Ë×K\	ÈÚ[HXY\\ÈÂÖÈ[\WHÛÛ[YBÚÚXÝ][KXYÒPÕÓSPTK[ÝÛ\ÕÓTK]\\Ù]Û[XÚÈYY	\ÛBÙ]Ú\ÜÝYWÙY[

HÂØØ[\ÜÝYWÛ[X\HHØØ[Y[HØØ[[YOHÈØØ[Ý]BÝ]OH
Ú\ÜÝYHY]È\ÜÝYWÛ[X\TSÔTÈKZÛÛÝ]HKZH	ËÝ]IÊHYÖÈÝ]HOHÔSWNÈ[XÚÈÚÚ\[ÈÛÜÙY\ÜÝYHÉ\ÜÝYWÛ[X\
	Y[I[YJH]\BÚÚXÝ][KYY]ÒPÕÓSPTK[ÝÛ\ÕÓTK]\ÎËÙÚ]XÛÛKÉSÔTËÚ\ÜÝY\ËÉ\ÜÝYWÛ[X\KYY[Y[K][YH[YHÙ]Û[BÙ]ÛX[J
HÂØØ[Y[HHØØ[[YOHÚYØØ[Ü[ÈÂÙ]Ú\ÜÝYWÙY[Y[[YHÛBBXÚÈ\ÜÚYÛ[È[Ü]Y\ËÙ]ÛX[H[Ü]HYÚÔSÔUWÒQÒÐ_HÙ]ÛX[H[Ü]HYY][HÔSÔUWÓQQUSVÐ_HÙ]ÛX[H[Ü]HÝÈÔSÔUWÓÕÖÐ_HXÚÈ\ÜÚYÛ[È\X\ËÙ]ÛX[H\XHÙXÝ\]HÐTPWÔÑPÕTUVÐ_HÙ]ÛX[H\XH]HÐTPWÑUVÐ_HÙ]ÛX[H\XHXÚÙ[ÐTPWÐPÒÑSÐ_HÙ]ÛX[H\XHÛ[ÐTPWÑÓSÐ_HÙ]ÛX[H\XH[\ÝXÝ\HÐTPWÒSTÕPÕTVÐ_HY

	ÈÐTPWÑÐÕSQSUSÓÐ_JJNÈ[Ù]ÛX[H\XHØÝ[Y[][ÛÐTPWÑÐÕSQSUSÓÐ_HBÈY\ÜÝYHÍHÝ[\È]È[\[Y[][Û
ÍÊHÜ[YXÝ][HØ\YÖÈ
Ú\ÜÝYHY]ÈHTSÔTÈKZÛÛÝ]HKZH	ËÝ]IÊHOHÔSWH	ÖÈ
ÚY]ÈÈTSÔTÈKZÛÛÝ]HKZH	ËÝ]IÈÙ]Û[YJHOHÔSWNÈ[XÚÈX\Ú[È\ÜÝYHÍH[]Y]ËÙ]Ú\ÜÝYWÙY[HÝ]\È[]Y]ÈBXÚÈÛÛYÝ\[ÈHY][XHY]ËUWÑQSÒQH
ÚÚXÝY[[\ÝÒPÕÓSPTK[ÝÛ\ÕÓTKYÜX]ÛÛKZH	ËY[Ö×HÙ[XÝ
[YOOH]HHY	ÂHSÔUWÑQSÒQH
ÚÚXÝY[[\ÝÒPÕÓSPTK[ÝÛ\ÕÓTKYÜX]ÛÛKZH	ËY[Ö×HÙ[XÝ
[YOOH[Ü]HHY	ÂHTPWÑQSÒQH
ÚÚXÝY[[\ÝÒPÕÓSPTK[ÝÛ\ÕÓTKYÜX]ÛÛKZH	ËY[Ö×HÙ[XÝ
[YOOH\XHHY	ÂHPÒÓÑ×ÕQU×ÒQH
Ú\HÜ\[Y]Y\OIÜ]Y\J	ÙÚ[Ý[ÈK	[X\[JHÂ\Ù\ÙÚ[	ÙÚ[HÂÚXÝ[X\	[X\HÂY]ÜÊ\Ý
HÈÙ\ÈÈY[YH^[Ý]HBBBIÈYÙÚ[HÕÓTQ[X\HÒPÕÓSPTKZH	Ë]K\Ù\ÚXÝY]ÜËÙ\Ö×HÙ[XÝ
^[Ý]OHPWÓVSÕUHY	ÈXY[BHYÖÈ^PÒÓÑ×ÕQU×ÒQWNÈ[XÚÈ\ÜÛÝ[ÝØØ]HHY][XHY]È^]BBÚ\HÜ\[Y]Y\OH]]][ÛÂ\]TÚXÝY]Ê[]ÂY]ÒYPÒÓÑ×ÕQU×ÒQ[YNXÚÛÙ×ÛÛYÝ\][ÛÂ\ÚXQY[YÎÂUWÑQSÒQÕUT×ÑQSÒQSÔUWÑQSÒQTPWÑQSÒQBBJHÂÚXÝY]ÈÈY[YH^[Ý]BBHÙ]Û[XÚÈÜX][ÈÛÜÙÝÈØ\UWÔTÕÒQH
Ú\HRQÚ]XP\KU\Ú[Û	TWÕTÒSÓÝ\Ù\ËÉÕÓTÜÚXÝÕÉÒPÕÓSPTÙY[ÈKZH	Ë×HÙ[XÝ
[YOOH]HHY	ÂHÕUT×ÔTÕÒQH
Ú\HRQÚ]XP\KU\Ú[Û	TWÕTÒSÓÝ\Ù\ËÉÕÓTÜÚXÝÕÉÒPÕÓSPTÙY[ÈKZH	Ë×HÙ[XÝ
[YOOHÝ]\ÈHY	ÂHSÔUWÔTÕÒQH
Ú\HRQÚ]XP\KU\Ú[Û	TWÕTÒSÓÝ\Ù\ËÉÕÓTÜÚXÝÕÉÒPÕÓSPTÙY[ÈKZH	Ë×HÙ[XÝ
[YOOH[Ü]HHY	ÂHTPWÔTÕÒQH
Ú\HRQÚ]XP\KU\Ú[Û	TWÕTÒSÓÝ\Ù\ËÉÕÓTÜÚXÝÕÉÒPÕÓSPTÙY[ÈKZH	Ë×HÙ[XÝ
[YOOH\XHHY	ÂHÓÔÑÕ×ÕTH
Ú\HVÔÕRXØÙ\\XØ][ÛÝÚ]XÚÛÛRQÚ]XP\KU\Ú[Û	TWÕTÒSÓÝ\Ù\ËÉÕÓTÜÚXÝÕÉÒPÕÓSPTÝY]ÜÈY[YOHÛÜÙÝÈY^[Ý]HØ\Y[\H\ÎÜ[Q\ÚXWÙY[Ö×OIUWÔTÕÒQQ\ÚXWÙY[Ö×OISÔUWÔTÕÒQQ\ÚXWÙY[Ö×OITPWÔTÕÒQQ\XØ[ÙÜÝ\ØV×OIÕUT×ÔTÕÒQKZH	Ë[Ý\	ÂHXÚÂXÚÈÚXÝÙ]\ÛÛ\]KXÚÈÚXÝ	ÒPÕÕTXÚÈÛÜÙÝÎ	ÓÔÑÕ×ÕTXÚÂXÚÈÛHX[X[Ý\[XZ[ÎXÚÈÚXÝOOÛÜÙÝÜÈO]]ËXYÈÚXÝOY]XÚÈ\ÜÚ]ÜN	SÔTÈXÚÈ[\\Î\ÜÝYH\ÎÜ[XÚÈ[ÚÛÜÙNØ]H[\ÛÛÜÙÝÈXÚÂXÚÈÝ\[ÚXÝ][\ÎÚÚXÝ][K[\ÝÒPÕÓSPTK[ÝÛ\ÕÓTK[[Z]KYY[Ý]\ÈKYY[[Ü]HKYY[\XB