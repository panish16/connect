# **Organization Contributing Guidelines**

Welcome\! This document defines the standard engineering workflows, governance, and coding philosophies for our organization.

Because we manage a shared core architecture across multiple distinct product lines, **these guidelines apply universally to all repositories within our organization unless explicitly overridden.**

If a specific repository contains its own `CONTRIBUTING.md`, please review that file for local environment setups, product-specific commands, or unique architectural notes. However, the core engagement and pull request workflows outlined below remain our organizational standard.

---
## **🏛️ Engineering Governance & Engagement**

To keep our architecture aligned and ensure your time is well spent, we follow a strict issue-first engagement model.

### **1\. Check for Existing Issues**

Before starting work on a feature or a bug fix, search the repository's Issue Tracker to ensure the work isn't already reported or in progress.

### **2\. Create an Issue**

If your proposed feature or fix is not tracked, open a new issue. Clearly outline the problem, the proposed technical solution, and the architectural impact. Please review and select a template that most closely aligns with what you are submitting.

### **3\. Await Approval (The "Stop" Gate)**

**Do not start writing code yet.** Wait for a core committer, Project Lead, or SRE to review your issue. They will ensure the proposal aligns with our overarching cloud-native strategy and roadmap. Once your issue is approved and assigned, you are clear to begin development.

---

## **The Standard GitHub Workflow**

We strictly follow the **Fork-Clone-Branch-PR** workflow across all products. Direct commits to `main` or `develop` branches are restricted.

### **A. Create the Fork-Clone-Branch**

You can use the Manual or GitHub CLI path.

#### **1\. Manual Flow**

A. **Fork the target repository** to your personal GitHub account.  
B. **Clone the project** to your local machine:

```shell
git clone https://github.com/your-personal-account/project-repo.git
cd project-repo
```

C. **Add the upstream remote** to keep your fork synchronized:

```shell
git remote add upstream https://github.com/bcgov/project-repo.git
```

D. **Create a feature branch** from the default branch. Use a descriptive naming convention (e.g., `feat/issue#-add-permit-api` or `fix/issue#-auth-token-refresh`):

```shell
git checkout -b feat/issue#-your-feature-name
```

#### **2\. [GitHub CLI](https://cli.github.com/) Flow**

**Optional**, but worth it. This will do all the stuff necessary to push your branches from local to your remotes.

```shell
git config --global push.autoSetupRemote true
```

and default your upstream repo

```shell
gh repo set-default bcgov/project-repo
```

A. **Fork, Clone and create your local** personal GitHub account.  
 This will fork, clone and set up your remotes correctly for upstream and origin.

```shell
gh repo fork bcgov/project-repo
```

B. **Create the branch**  
 There are 2 options here based upon where the issue is listed. Some projects keep their issues in the repo, others reference some or all their issues in the [*Entities*](https://github.com/bcgov/entity/issues) repo

i. For issues in the same repo you can:

```shell
gh issue develop <issue-number> --checkout
```

ii. For issues in tracked in a different repo, you can create a local branch:

```shell
git switch -c feat/issue#-your-feature-name
```

---

### **B. Test, Lint and Commit**

All submissions must have accompanying tests to demonstrate the code meets the requirements listed in the referenced issue. Code must pass the linting. Commit messages should follow the conventional commits standard.

#### **Tests**

Most projects will have a `Makefile` with a test target. You can run tests via:

```shell
make test
```

or checking the local projects listed testing commands.

#### **Linting**

Most projects will have a `Makefile` with a lint target. You can run linting via:

```shell
make lint
```

or checking the local projects listed linting commands.

#### **Pre-Commit Hooks**

This repo uses [Lefthook](https://github.com/evilmartians/lefthook) to run lint, typecheck and [gitleaks](https://github.com/gitleaks/gitleaks) secret scanning automatically before each commit. Hooks are installed for you the first time you run `pnpm install` (no manual setup) - `pnpm install` also downloads the official gitleaks binary directly from its GitHub releases, verified against the release's published checksum.

If a commit is blocked by a false-positive secret match, add an allowlist entry to `.gitleaks.toml` rather than bypassing the hook. `git commit --no-verify` skips these checks and should only be used in exceptional cases, since CI runs the same scan as a backstop.

#### **Commits**

Commit messages must adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is a hard requirement enforced by our CI pipelines for automated changelog generation and semantic versioning.

**Format:**

```shell
git commit -m "<type>[optional scope]: <description>"
```

*Examples: `feat(db): enforce plural table names`, `fix(ui): resolve layout shift`, `chore: update pnpm lockfile`*

---

## **C. Pull Request Protocol**

Once your feature is complete, tested, and linted:

1. Push your branch to your fork.  
    `git push`  
    \*automatic if you set `autoSetupRemote`

2. Open a Pull Request against the upstream repository's target branch  
    if using the CLI:  
    `gh pr create --title "fix: ..." --body "Closes bcgov/entity#123"`  
    \*automatic if you set `set-default`  
    if using the Web UI:  
    Complete the provided PR template in its entirety, explicitly linking the approved issue (e.g., `Closes #123`).

3. Ensure all automated CI checks (tests, linting, commit formats) pass.

4. Address any requested changes from the code review phase.

---

## **🛠️ Development & Environment Standards**

### **The Target Stack**

The common tools and stacks that are in current use or are actively being migrated to are listed below. Any changes or additions must go through the [RFC process](https://github.com/bcgov/connect/discussions/categories/rfcs). Smaller changes may be accepted via a decision or other lighter weight process, as accepted by the SRE team.

#### **Web Front End and BFF development**

All of our web products target mobile-first, accessible and multi-lingual services.

* pnpm  
* vite  
* Nuxt 4  
* Nuxt UI  
* Tailwind  
* [Connect-Nuxt](https://github.com/bcgov/connect-nuxt) common layers  
  * this includes a11y via axe and [nuxt-a11y](https://nuxt.com/modules/a11y)  
  * i18n

#### **API, Services, Jobs**

All of our common APIs must be published in OAS3.0.

* uv  
* Python  
* pytest  
* SQLAlchemy  
* Flask or FastAPI  
* Jupyter Notebooks (Runbooks, Jobs)  
   Upon approval:  
* go  
* rust

### **Devcontainers (Strongly Encouraged)**

To eliminate environment discrepancies, we strongly encourage using the provided Devcontainer in each repository. This ensures your local setup perfectly mirrors our CI/CD pipelines. Devcontainers are either in the root of the repo, or in older repos are in each service.

* Open the repository or subdirectory in VS Code.  
* Ensure the Dev Containers extension is installed.  
* Click **"Reopen in Container"** when prompted.

\*note: Any IDE that supports devcontainers can be used, our examples will only show VS Code.

### **2\. Local Setup (Fallback)**

If you are running the environment manually, refer to the target repository's local `README.md` or `CONTRIBUTING.md`. As an organizational standard, we utilize `pnpm` for node-based dependency management and uv/poetry for python services to strictly control lockfiles:

```shell
# Example generic setup
pnpm install
pnpm run dev
```

```shell
# Example generic setup
poetry install
poetry run pytest
```

---

## **👑 Path to Maintainership**

Thank you for your interest\!  
 We are actively looking to empower developers who demonstrate a deep understanding of our architecture and coding standards. The path to gaining elevated access is transparent and consistent across all product lines. This applies to project staff, contractors and anyone else wanting to have a deeper engagement in the project.

1. **Consistent High-Quality Contributions:** Successfully merge several Pull Requests that require minimal rework and adhere strictly to our design patterns.  
2. **Community & Code Review:** Actively participate in reviewing other contributors' PRs and helping triage issues.  
3. **Nomination:** An existing Maintainer, Project Lead, or SRE must formally nominate you based on your track record.  
4. **Access Granted:** Upon approval, you will be granted `Write` access to the applicable repositories, joining the core technical team.
