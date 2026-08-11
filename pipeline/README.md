# BetterMeycauayan OpenLGU pipeline

This directory is separated by jurisdiction. Only `meycauayan/` and generated
`openlgu/` files are active pipeline inputs.

- `meycauayan/` contains configuration and future Meycauayan source material.
- `openlgu/` contains generated JSONL for staging and review; it is ignored by Git.

The scripts fail closed when they encounter Los Baños URLs, names, legislative
terminology, archived paths, or `sb_*` term identifiers.

The original website and Facebook collectors remain available only through npm
commands whose names include `legacy-los-banos`. The default shadow workflow uses
the Meycauayan collector entry point and will stop without writing output until
that collector is implemented.

Do not copy files from the legacy archive into `meycauayan/`. It is retained only
for historical reference while the Meycauayan collector is developed.
