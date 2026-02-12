Extract and verify game data from the 学園アイドルマスター community wiki.

Target URL: https://wikiwiki.jp/gakumas/$ARGUMENTS

Steps:
1. Fetch the wiki page content
2. Extract relevant game data (parameter values, item effects, formulas, etc.)
3. Compare extracted data against what is recorded in `_docs/DATA_COLLECTION.md` and `_docs/GAME_MECHANICS.md`
4. Report any discrepancies, new data, or corrections found
5. If new verified data is found, update `_docs/DATA_COLLECTION.md` with the new values and mark their verification status
6. Summarize what was extracted, what matched, and what was updated

Common pages to scrape:
- `初LEGEND` — Legend Lesson base values, weekly schedule
- `初LEGEND/チャレンジPアイテム` — Challenge P-Item catalog
- `ステージ総合力算出` — Stage power and scoring formulas
- `システム関連` — General game system mechanics
