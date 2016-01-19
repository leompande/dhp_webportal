#!/bin/bash
curl --data-binary @datavalueset.csv "https://139.162.204.124/training/api/dataValueSets" -H "Content-Type:application/csv" -u Demo:HMISDEMO2016 -v