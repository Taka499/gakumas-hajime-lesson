Add a new Challenge P-Item to the calculator engine.

Read the current engine code at `src/engine/calculator.ts` and the data reference at `_docs/DATA_COLLECTION.md`. Then:

1. Add the new item to the appropriate enum (`Slot1Item`, or create `Slot2Item`/`Slot3Item` if needed)
2. Add its effect to the relevant lookup table and calculation function
3. Add unit tests in `src/engine/calculator.test.ts` covering:
   - The item's effect when the boosted stat IS the selected parameter
   - The item's effect when the boosted stat is NOT the selected parameter
   - Edge cases (e.g., stacking with other effects if applicable)
4. If it's a UI-selectable item, update the corresponding component in `src/components/`
5. Update `_docs/DATA_COLLECTION.md` with the item's verified data
6. Run `bun test` to confirm all tests pass

Item to add: $ARGUMENTS
