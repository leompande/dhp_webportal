#!/bin/bash
curl --data-binary @datavalueset.csv "http://139.162.204.124/mvc/api/dataValueSets" -H "Content-Type:application/csv" -u lmpande:DHIS2014 -v