import { useCallback, useState } from 'react';

const notesKey = (recipeId) => `arf.notes.${recipeId}`;

const loadNotes = (recipeId) => {
  try {
    return JSON.parse(localStorage.getItem(notesKey(recipeId))) ?? [];
  } catch {
    return [];
  }
};

const saveNotes = (recipeId, notes) => {
  try {
    localStorage.setItem(notesKey(recipeId), JSON.stringify(notes));
  } catch {}
};

/**
 * Private notes for one recipe. Persists to localStorage.
 *
 * Each note: { id, text, createdAt, updatedAt }
 *
 * TODO: swap localStorage with API calls:
 *   GET    /recipes/{id}/notes
 *   POST   /recipes/{id}/notes   { text }
 *   PUT    /notes/{noteId}       { text }
 *   DELETE /notes/{noteId}
 */
export function useRecipeNotes(recipeId) {
  const [notes, setNotes] = useState(() => (recipeId ? loadNotes(recipeId) : []));

  const persist = useCallback(
    (next) => {
      setNotes(next);
      if (recipeId) saveNotes(recipeId, next);
    },
    [recipeId],
  );

  const addNote = useCallback(
    (text) => {
      const note = {
        id: `note-${Date.now()}`,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persist([note, ...notes]);
      return note;
    },
    [notes, persist],
  );

  const updateNote = useCallback(
    (id, text) =>
      persist(
        notes.map((n) =>
          n.id === id ? { ...n, text: text.trim(), updatedAt: new Date().toISOString() } : n,
        ),
      ),
    [notes, persist],
  );

  const deleteNote = useCallback(
    (id) => persist(notes.filter((n) => n.id !== id)),
    [notes, persist],
  );

  return { notes, addNote, updateNote, deleteNote };
}
