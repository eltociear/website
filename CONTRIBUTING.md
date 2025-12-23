# Contributing to Global Governance Frameworks

First, thank you for considering a contribution to this project. Every bug report, content suggestion, and line of code helps move this ambitious vision forward.

This document provides a guide for contributing to the project in its **current foundational phase**. Our immediate priority is auditing and refining the core frameworks and establishing our formal non-profit organization. As such, our contribution process is centralized here on GitHub to maintain focus.

## Guiding Principles for Contribution

  * **GitHub is our center of operations.** All work is tracked in [Issues](https://www.google.com/search?q=https://github.com/your-repo/your-project/issues), and all changes are proposed via [Pull Requests](https://www.google.com/search?q=https://github.com/your-repo/your-project/pulls).
  * **Focus on high-priority tasks.** Our immediate needs are outlined in the issues labeled `high-priority` and `help-wanted`.
  * **Asynchronous collaboration.** We value deep work. Most communication and review happens asynchronously in Issues and PR comments.

## 🏗 The State of the Code (Read this first!)

**Honesty Time:** This project was architected by a Systems Thinker utilizing AI tools (LLMs) to generate much of the initial codebase.

As a result, you will likely encounter:
* **Inline Styles:** Lots of them. We want to move these to CSS classes or standard components.
* **Repetition:** Components that should be shared are sometimes copy-pasted.
* **"Brute Force" Logic:** Things that work but aren't elegant.

**We view this as a feature, not a bug.** It means there are *hundreds* of easy ways for you to make an immediate impact. We are not looking for perfection; we are looking for progress.

If you see ugly code, **please fix it.** You don't need permission to propose a refactor.

## How You Can Contribute

There are three main ways to contribute right now: reporting issues, improving content, and writing code.

### 1\. Reporting Bugs and Discussing Ideas

The easiest way to contribute is to use the project and tell us what you think.

  * **Found a bug?** Check if an [Issue](https://www.google.com/search?q=https://github.com/your-repo/your-project/issues) already exists. If not, [create a new one](https://www.google.com/search?q=https://github.com/your-repo/your-project/issues/new/choose) with a clear description and steps to reproduce.
  * **Have an idea or ethical concern?** We welcome deep, strategic discussions. Please [start a new discussion thread](https://www.google.com/search?q=https://github.com/your-repo/your-project/discussions) to share your thoughts on a framework or proposal.

### 2\. Content, Framework, and Translation Contributions

Our frameworks are the heart of the project. Due to the ongoing audit, the process for major content contributions is currently more structured.

  * **To suggest a change to an existing framework:** Please open an [Issue](https://www.google.com/search?q=https://github.com/your-repo/your-project/issues/new/choose) detailing your suggestion. This allows for discussion before any time is spent on implementation.
  * **To help with translations:** We are not actively adding new languages at this moment, but we are focused on improving our existing Swedish and English translations. If you find a linguistic error or a poor translation, please open an [Issue](https://www.google.com/search?q=https://github.com/your-repo/your-project/issues/new/choose).

### 3\. Code Contributions

Technical contributions are highly welcome, especially those that address existing bugs or improve site health.

1.  **Find an Issue:** Start by looking for issues tagged with `bug` or `help-wanted`. Comment on the issue to let us know you're planning to work on it.
2.  **Fork and Branch:** Fork the repository and create a new branch for your work (e.g., `git checkout -b fix/header-capitalization`).
3.  **Make Your Changes:** Write your code, adhering to the existing style and structure.
4.  **Test Locally:** Ensure your changes work as expected by running the project locally (`npm run dev`).
5.  **Submit a Pull Request:** Open a Pull Request from your branch to our `main` branch. In the description, link to the issue you are fixing (e.g., "Fixes \#14").

## Project Setup

To work on the project locally, you will need Node.js and npm installed.

```bash
# Clone your fork
git clone https://github.com/GlobalGovernanceFrameworks/website.git
cd ggf-website

# Install dependencies
npm install

# Run the development server
npm run dev
```

## A Note on Community Channels

To allow our team to focus on the current foundational work, our Discord server is temporarily a **private workspace for active contributors**. All project-related discussions and support requests should be made via GitHub Issues and Discussions. This ensures all communication is documented and accessible.

Thank you again for your interest. We are building a complex but vital project, and your support is deeply appreciated.
