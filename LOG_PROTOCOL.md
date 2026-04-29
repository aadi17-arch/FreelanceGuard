# 📜 FreelanceGuard: Logging Protocol

This document defines the mandatory rules for maintaining the **`LOG.md`** audit trail. All project participants (Human and AI) must adhere to these standards.

---

## 🚦 The Primary Rule
The `LOG.md` is for **Project Actions**, not **Study Sessions**.
- ✅ **LOG**: Adding a feature, changing a style, fixing a bug, updating a schema, project-wide refactoring.
- ❌ **DON'T LOG**: Theoretical discussions, learning sessions, explaining code concepts, or knowledge-sharing that doesn't change the codebase.

---

## 🏗️ Entry Structure
Every entry must follow the established institutional format to ensure readability and professionalism.

### 1. Update Entry (`[UPDATE #XXX]`)
Used for new features, design refinements, or structural changes.
```text
[UPDATE #XXX] – SHORT DESCRIPTIVE TITLE
--------------------------------------------------------------------------------
[DATE]       : YYYY-MM-DD
[AUTHOR]     : [USER] or [COMPUTER]
[TYPE]       : UI/UX, LOGIC, SYNC, etc.
[CHANGES]    : 
  - Bullet point of change A
  - Bullet point of change B
[RATIONALE]  : The "Why" behind the change.
[STATUS]     : COMPLETED
--------------------------------------------------------------------------------
```

### 2. Crash/Fix Entry (`[CRASH/FIX #XXX]`)
Used for resolving runtime errors, syntax bugs, or environmental issues.
```text
[CRASH/FIX #XXX] – ERROR TITLE
--------------------------------------------------------------------------------
[DATE]       : YYYY-MM-DD
[AUTHOR]     : [USER] or [COMPUTER]
[TYPE]       : BACKEND, FRONTEND, IDE, etc.
[PROBLEM]    : Description of the crash or error.
[FIX]        : How the problem was resolved.
[RESULT]     : The outcome of the fix.
[STATUS]     : RESOLVED
--------------------------------------------------------------------------------
```

---

## 🛡️ Integrity Rules
1. **No Overwriting**: Never edit or delete existing log entries. History must be preserved exactly as it happened.
2. **Sequential Numbering**: Ensure every update or fix follows the next number in the sequence (e.g., #001 -> #002).
3. **Institutional Tone**: Use clear, professional, and "Sentence Case" language. Avoid jargon where simple English works.
4. **Author Crediting**: 
   - **[USER]**: For all Logic, Backend, and Business Rule implementations.
   - **[COMPUTER]**: For UI, Styling, Documentation, and Automated Maintenance.

---

## 📼 Deployment Protocol
When adding to the log, use the **"Append Only"** method. Insert new entries at the top or bottom as directed, without modifying the existing audit trail.

**Status**: *Protocol Active & Engraved.* 🥂💼🏛️
