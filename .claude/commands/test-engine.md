Run the calculation engine tests and validate results.

1. Run `bun test` and report all results
2. If any tests fail, read the failing test in `src/engine/calculator.test.ts` and the engine code in `src/engine/calculator.ts`
3. Diagnose the root cause by comparing expected values against the formulas documented in `_docs/GAME_MECHANICS.md` and `_docs/DATA_COLLECTION.md`
4. Fix the issue — prefer fixing the code if the test expectation matches the documented formula, or fix the test if the documented formula was applied incorrectly
5. Re-run `bun test` to confirm all tests pass
6. Report a summary of what was tested and any fixes applied
