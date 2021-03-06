var onSearch = (function () {
    var timeout = null,
        defaultOptions = {
            delay: 300,
            onEach: $.noop,
            onStart: $.noop
        };
    return function ($el, options, fn) {
        var started = false;
        $el = $el instanceof jQuery ? $el : $($el);
        fn = typeof options === 'function' && !fn ? options : fn;
        options = $.extend(null, defaultOptions, options);
        $el.on('keyup change', function (e) {
            options.onEach(e, options.delay);
            if (!started) {
                options.onStart(e, options.delay);
                started = true;
            }
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                started = false;
                fn($(e.currentTarget).val());
            }, options.delay);
        });
    };
})();

var popular = function () {
    loading();

    GiphyApi.trending()
        .done(function (data) {
            showPhotos(data.data);
        })
        .fail(function (data) {
            $('.loading').hide();
            resultsText(null, true, null);
        })
};

var loading = function () {
    $('#photos').hide();
    $('.loading').fadeIn();
};

var resultsText = function (q, error, resultCount) {
    var container = $('#photos').html('').show();

    var noResultsDiv = $('<div>').attr('class', 'photosresults');
    if (error) {
        noResultsDiv.text('Crap, something bad happened, try later will you?');
    } else if (!resultCount) {
        noResultsDiv.text('Sorry, \'' + (q ? q : 'trending') + '\' has no results.');
    } else {
        if (q) {
            noResultsDiv.text('We have found ' + resultCount + ' results for \'' + q + '\' query.');
        }
    }

    noResultsDiv.appendTo(container).fadeIn();
}

var showPhotos = function (photos, q) {
    $('.loading').hide();
    var container = $('#photos').html('').show();
    var delay = 80;

    resultsText(q, null, photos.length);

    photos.forEach(function (photo, i) {
        var linkUrl = photo.images.original.url;
        var imageThumbUrl = photo.images.fixed_height.url;

        var link = $('<a>').attr('target', '_blank').attr('href', linkUrl);
        var img = $('<img>').attr('alt', photo.username);

        img.attr('src', imageThumbUrl);
        link.html(img).hide();

        setTimeout(function () {
            link.appendTo(container).fadeIn();
        }, delay * i);
    });
};

var search = (function () {
    var lastSearch = '';
    return function (q) {
        if (!q) return popular();
        if (lastSearch === q) return;
        loading();
        lastSearch = q;

        GiphyApi.search(q)
            .done(function (data) {
                showPhotos(data.data, q);
            })
            .fail(function (data) {
                $('.loading').hide();
                resultsText(q, true, null);
            })
    };
})();

onSearch('.search', function (q) {
    search(q);
});

$('.form-search').submit(function (e) {
    search($('.search').val());
    return false;
});

popular();