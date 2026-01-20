# How to Add a Poem

This site stores poems as Markdown files in the repository.  
You do **not** need to run any code to add a poem.

---

## Where poems live

All poems are stored in: content/poems/


Each poem is its own `.md` file.

---

## Step-by-step (GitHub website)

1. Go to the `content/poems/` folder in the repository
2. Open the file `_TEMPLATE.md`
3. Click **“Copy raw contents”**
4. Click **“Add file” → “Create new file”**
5. Name the file something sensible (the filename does not matter technically)
6. Paste the template contents
7. Fill in the fields (see below)
8. Paste the poem text under the front-matter
9. Scroll down and click **Commit changes**

---

## Required front-matter fields

Every poem must start with this block:

---
title: "Poem title"
slug: "poem-title-in-lowercase"
date: "YYYY-MM-DD"
excerpt: "One short sentence used for previews"
tags: [example, learning]
---

## BREAKDOWN OF EACH FIELD

title  - the poems displayed title, can include puncuation and capitals

slug   - the section of the URL that is specific to the poem, no capitals, no punctuation just words 
         seperated by hyphens, can never be changed. e.g. "every-women-deserves-a-fairytale"

date   - format YYYY-MM-DD

excert - One short sentence (used in poem listings). If unsure, use the first line of the poem

tags   - lowercase only, single word or hypthenated, no punctuation can be empty. 
         e.g tags: [love, grief, family, anger, betrayal]

Write the poem exactly how you want it to appear.
Do not worry about formatting — the site preserves it.