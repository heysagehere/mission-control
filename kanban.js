#!/usr/bin/env node
/**
 * Kanban CLI - Command line tool for updating Mission Control
 * 
 * Usage:
 *   node kanban.js add "Task title" --owner Alex --project alex-ops --priority high
 *   node kanban.js move <id> <column>
 *   node kanban.js done <id>
 *   node kanban.js list [--column <col>] [--owner <owner>]
 *   node kanban.js push
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function nextId(data) {
  const maxId = Math.max(...data.cards.map(c => parseInt(c.id) || 0), 0);
  return String(maxId + 1);
}

function addCard(title, opts = {}) {
  const data = loadData();
  const card = {
    id: nextId(data),
    column: opts.column || 'backlog',
    title,
    owner: opts.owner || 'Alex',
    project: opts.project || 'alex-ops',
    priority: opts.priority || 'medium',
    notes: opts.notes || ''
  };
  data.cards.push(card);
  saveData(data);
  console.log(`✓ Added card #${card.id}: "${title}"`);
  return card;
}

function moveCard(id, column) {
  const data = loadData();
  const card = data.cards.find(c => c.id === id);
  if (!card) {
    console.error(`Card #${id} not found`);
    process.exit(1);
  }
  const oldCol = card.column;
  card.column = column;
  if (column === 'done') {
    card.completedAt = new Date().toISOString().split('T')[0];
  }
  saveData(data);
  console.log(`✓ Moved #${id} "${card.title}" from ${oldCol} → ${column}`);
}

function listCards(opts = {}) {
  const data = loadData();
  let cards = data.cards;
  
  if (opts.column) cards = cards.filter(c => c.column === opts.column);
  if (opts.owner) cards = cards.filter(c => c.owner.toLowerCase() === opts.owner.toLowerCase());
  if (opts.project) cards = cards.filter(c => c.project === opts.project);
  
  if (cards.length === 0) {
    console.log('No cards found');
    return;
  }
  
  const grouped = {};
  cards.forEach(c => {
    if (!grouped[c.column]) grouped[c.column] = [];
    grouped[c.column].push(c);
  });
  
  for (const [col, colCards] of Object.entries(grouped)) {
    console.log(`\n${col.toUpperCase()} (${colCards.length})`);
    colCards.forEach(c => {
      console.log(`  #${c.id} [${c.owner}] ${c.title}`);
    });
  }
}

function pushToGitHub() {
  try {
    execSync('git add .', { cwd: __dirname, stdio: 'inherit' });
    execSync('git commit -m "Update kanban"', { cwd: __dirname, stdio: 'inherit' });
    execSync('git push origin main', { cwd: __dirname, stdio: 'inherit' });
    console.log('\n✓ Pushed to https://heysagehere.github.io/mission-control/');
  } catch (e) {
    console.log('Nothing to push or push failed');
  }
}

// CLI
const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === 'help') {
  console.log(`
Kanban CLI

Commands:
  add <title> [options]    Add a new card
    --owner <name>         Owner (default: Alex)
    --project <id>         Project ID (default: alex-ops)
    --priority <level>     high|medium|low (default: medium)
    --column <col>         Column (default: backlog)
    --notes <text>         Notes
  
  move <id> <column>       Move card to column
  done <id>                Mark card as done
  list [options]           List cards
    --column <col>         Filter by column
    --owner <name>         Filter by owner
  push                     Push changes to GitHub
  `);
  process.exit(0);
}

// Parse options
function parseOpts(args) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      opts[key] = args[i + 1] || true;
      i++;
    }
  }
  return opts;
}

switch (cmd) {
  case 'add':
    const title = args[1];
    if (!title) {
      console.error('Usage: kanban add <title> [options]');
      process.exit(1);
    }
    addCard(title, parseOpts(args.slice(2)));
    break;
  
  case 'move':
    moveCard(args[1], args[2]);
    break;
  
  case 'done':
    moveCard(args[1], 'done');
    break;
  
  case 'list':
    listCards(parseOpts(args.slice(1)));
    break;
  
  case 'push':
    pushToGitHub();
    break;
  
  default:
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
}
