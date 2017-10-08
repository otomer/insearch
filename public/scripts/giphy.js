var GiphyApi = {
    API_KEY: 'Rh13IWLYRuIyV9xGS5whERM1HlGMjrTK',
    LIMIT: 50,
    RATING: 'R', //Y, G, PG, PG-13, R
    LANGUAGE: 'iw',
    url: {
        _set: function (url) {
            return url
                .replace("<api_key>", GiphyApi.API_KEY)
                .replace("<limit>", GiphyApi.LIMIT)
                .replace("<lang>", GiphyApi.LANGUAGE)
                .replace("<rating>", GiphyApi.RATING);
        },
    },
    trending: function () {
        return $.ajax({ url: GiphyApi.url._set("https://api.giphy.com/v1/gifs/trending?api_key=<api_key>&limit=<limit>&rating=<rating>") })
    },
    search: function(q) {
        return $.ajax({
            url: GiphyApi.url._set("https://api.giphy.com/v1/gifs/search?api_key=<api_key>&q=<q>&limit=<limit>&offset=0&rating=<rating>&lang=<lang>").replace("<q>", q),
        })
    }
}