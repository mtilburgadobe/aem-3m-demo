# Search

Site search for the pilot without a query index. Indexes the internal pages linked from the
page's nav (and any links authored inside the block), fetches each page's `.plain.html`, and
ranks matches (title hits weigh more). Reads the query from `?q=`.

Content model: a `Search` block; optional rows containing extra page links to include.
The header search field targets this page via the nav's "Search" link (`/personal-auto/search?q=`).
