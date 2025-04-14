# Hi there!

## RDM Details + API Key https://raildata.org.uk/dashboard/dataProduct/P-7c866984-8a7b-4272-a6f8-00b4aaf821fa/specification

Note: RDM APIs are not currently used here.

## Module details

~~See https://github.com/mattsalt/national-rail-darwin for more information~~

~~Could update to https://github.com/DanielHartUK/national-rail-darwin-promises at some point potentially.~~

Now using custom module, see https://lite.realtime.nationalrail.co.uk/openldbws/ for API information (XML).

JSON docs: https://realtime.nationalrail.co.uk/LDBWS/docs/documentation.html (not currently used)

## Unresolved bugs

- done - Detect split trains (Clapham Junction to Portsmouth Harbour, etc...)
- done - Repacement Bus services check?

## Notes on different boards

- When arr/dep board fetched, sub calling points and prev calling points are accessible
- When dep board is fetched, only sub calling points are accessible