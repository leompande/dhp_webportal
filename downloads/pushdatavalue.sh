#!/bin/bash
curl --data-binary @datavalueset.csv "http://139.162.204.124/training/api/dataValueSets" -H "Content-Type:application/csv" -u Demo:HMISDEMO2015 -v