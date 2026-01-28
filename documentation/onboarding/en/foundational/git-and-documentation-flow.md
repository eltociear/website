# **Guide: Git & Our Documentation Flow**

Welcome to the backbone of our collaboration. All our work – from framework texts to project plans – is stored and developed using a system called **Git** and a platform called **GitHub**.

* **Why do we use it?** To be able to work together in an open, transparent, and asynchronous way. It functions as a "time machine" that lets us see all changes made, by whom, and why. It's crucial for our autonomous work model to function.

## **Getting Started: Your Tools**

You can choose the path that suits you best. For beginners, we recommend the visual path.

* **Option 1: The Visual Path (Recommended for beginners)**

  1. **Create an account:** Go to [GitHub.com](https://github.com) and create a free account.
  2. **Install GitHub Desktop:** Download and install [GitHub Desktop](https://desktop.github.com/). This program becomes your main "control panel".

* **Option 2: The Terminal Path (For the technically curious)**

  1. **Create an account:** Go to [GitHub.com](https://github.com) and create a free account.
  2. **Install Git:** Make sure you have Git installed on your computer.
     * On **Linux** it's usually pre-installed. Otherwise: `sudo apt-get install git` (Debian/Ubuntu) or equivalent for your distribution.
     * On **Mac** you can install it via `xcode-select --install` in Terminal.
     * On **Windows** it's easiest to install [Git for Windows](https://git-scm.com/download/win), which gives you the "Git Bash" program.

## **Our Workflow: From Idea to Finished Contribution**

Here is our process in six steps. For each step, both methods are shown.

### **Step 0: Find or Create a Task (GitHub Issues)**

This step is the same regardless of which path you choose, since it takes place on GitHub's website. Before you start working, find or create an **"Issue"** (task) on the project's "Issues" tab. This ensures that all work is connected to a specific goal.

### **Step 1: Create a Workspace (Create a Branch)**

All work takes place in its own "branch" to keep the main project clean and stable.

* **Visual Path (GitHub Desktop):**

  1. Click on "Current Branch" at the top.
  2. Click on "New Branch".
  3. Name your branch according to the pattern `your-initials/issue-number-description` (e.g., `bkh/21-improve-git-guide`).

* **Terminal Path (Command Line):**

  1. Make sure you have the latest version of the main project and are on the main branch (`main`).
     ```bash
     # Switch to the main branch
     git checkout main

     # Fetch the latest changes from GitHub
     git pull origin main
     ```
  2. Create and switch to your new branch with a single command.
     ```bash
     # Create a new branch and switch to it
     git checkout -b bkh/21-improve-git-guide
     ```

### **Step 2: Make the Changes**

This is the creative work and is done in your favorite text editor, regardless of workflow.

* **A Quick Guide to Markdown:**
  * `# Heading 1`
  * `## Heading 2`
  * `**Bold text**`
  * `*Italic text*`
  * `- A bullet point in a list`
  * `[A link to GGF](https://globalgovernanceframeworks.org)`

### **Step 3: Save Your Work (Commit)**

A "Commit" is a saved logbook entry of your changes.

* **Visual Path (GitHub Desktop):**

  1. Write a short, descriptive summary in the "Summary" field.
  2. Click the "Commit to `[your-branch-name]`" button.

* **Terminal Path (Command Line):**

  1. Add the files you want to save to the "staging area".
     ```bash
     # Add all changed files
     git add .
     ```
  2. Create your "commit" with a clear message.
     ```bash
     # Save the "staged" files with a message
     git commit -m "Clarified the workflow in the git guide"
     ```

### **Step 4: Publish Your Workspace (Push)**

Upload your saved changes (commits) to GitHub.

* **Visual Path (GitHub Desktop):**

  * Click the **"Push origin"** button.

* **Terminal Path (Command Line):**

  * The first time you push a new branch, use `-u` to link your local branch to the one on GitHub.
    ```bash
    # Upload your branch to GitHub
    git push -u origin bkh/21-improve-git-guide
    ```
  * Subsequent times on the same branch, `git push` is sufficient.

### **Step 5: Propose Your Change (Pull Request)**

When you're done, create a "Pull Request" (PR) to request that your work be incorporated into the main project. This step takes place on GitHub's website.

* **How to do it:**
  1. After you have "pushed" your branch, go to the project's page on GitHub.
  2. You will see a yellow box with the name of your branch and a button: **"Compare & pull request"**. Click on it.
  3. Give your PR a clear title and description. Write "Closes #21" (replace with the correct number) in the description to link it to your "Issue".
  4. Click "Create Pull Request".

Now your contribution is submitted for review. This system is the heart of how we can build the project together in a transparent and structured way.
