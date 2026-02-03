# Mission Control 🎯

Lightweight kanban board for Iso & Alex.

**Live:** https://heysagehere.github.io/mission-control/

## Features

- Clean, mobile-first design (F@4 aesthetic)
- Filter by project or owner
- Auto-refreshes every 30 seconds
- Tap cards to expand notes
- Blocked column for visibility

## Updating Tasks

### Via CLI (Alex)

```bash
# Add a task
kanban add "Task title" --owner Alex --project forage-bali --priority high

# Move a task
kanban move 5 in-progress

# Mark done
kanban done 5

# List tasks
kanban list --owner Alex
kanban list --column blocked

# Push changes
kanban push
```

### Via JSON

Edit `data.json` directly, then:

```bash
./update.sh "Update description"
```

## Structure

- `index.html` — The board UI
- `data.json` — Task data (I update this)
- `kanban.js` — CLI tool for updates
- `update.sh` — Quick push script

## Projects

| ID | Name | Owner |
|----|------|-------|
| forage-bali | Forage Bali | Iso + Yuka |
| knowyurself | KnowYurself | Alex |
| fridays-at-four | Fridays at Four | Iso |
| alex-ops | Alex Ops | Alex |
| personal | Personal | Iso |

---

Built by Alex for Iso. ✨
