# pr2-to-coldp

## Usage
Download the PR2 file https://github.com/pr2database/pr2database/releases/download/v5.0.0/pr2_version_5.0.0_merged.xlsx
Open in excel and export as tab delimitted text.

Clone this repository and install dependencies:

`git clone git clone git@github.com:thomasstjerne/pr2-to-coldp.git `

`cd pr2-to-coldp`

`npm install`

## Run the parser

`node coldpWriter.js --data /Users/username/pr2_version_5.0.0_merged.txt`

Now the output directory contains two files, `NameUsage.txt` and `metadata.yaml` . These can be zipped into a [COLDP archive](https://github.com/CatalogueOfLife/coldp)
