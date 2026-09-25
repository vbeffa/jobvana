# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## GitHub Project setup

The repository includes `scripts/setup-github-project.sh` to create and seed the user-owned **Jobvana** GitHub Project.

### Prerequisites

Install the GitHub CLI and authenticate as `vbeffa`. The token must include the `project` scope:

```bash
gh auth status
gh auth refresh -s project
```

The refresh command is only needed when the existing login does not already have project access. The script also verifies that the configured repository is accessible before creating the project.

Optional environment variables can override the defaults:

```bash
OWNER=vbeffa
REPO=vbeffa/jobvana
PROJECT_TITLE=Jobvana
```

### Run the setup

```bash
bash scripts/setup-github-project.sh
```

The script:

- refuses to create a duplicate while an open project with the configured title already exists;
- creates the project and links it to `vbeffa/jobvana`;
- configures the `Status`, `Priority`, and `Area` fields;
- imports all currently open issues;
- assigns the current Jobvana backlog to Priority and Area values;
- marks issue #45 as `In review` when its implementation PR #47 is still open;
- configures a `Backlog` table and a Status-grouped `Workflow` board; and
- prints the project URLs and current project items when setup finishes.

The Priority and Area assignments are intentionally issue-number-specific. Review the arrays near the top of the script before running it if the backlog has changed.

### Enable automatic issue import

GitHub's **Auto-add to project** workflow still needs to be enabled in the Project UI after the script runs:

1. Open the Jobvana project.
2. Choose **... → Workflows → Auto-add to project → Edit**.
3. Set the repository to `vbeffa/jobvana`.
4. Set the filter to `is:issue is:open`.
5. Choose **Save and turn on workflow**.

This keeps future open Jobvana issues in the project automatically.
