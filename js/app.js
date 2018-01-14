// https://rawsawcoldpress.pl/zamow-soki/

function createNewBottle(index, items) {
    items[index].ingredients = items[index].ingredients.toString().replace(/,/g, ', ')
    var newBot = '<div class="col-md-6 col-lg-4 a-bottle">' +
        '<img src="' + items[index].pic + '" alt="green-velvet-juice"/>' +
        '<h4>' + items[index].title + '</h4>' +
        '<p>' + items[index].ingredients + '</p>' +
        '<div class="row a-bottle-ui">' +
        '<div class="col-6 add-to-basket">' +
        '<i class="fa fa-cart-plus" aria-hidden="true"' +
        ' id="add_' + index + '"></i>' +
        '</div>' +
        '<div class="col-6 remove">' +
        '<i class="fa fa-minus-circle" aria-hidden="true"' +
        ' id="remove_' + index + '"></i>' +
        '</div>' +
        '</div>' +
        '</div>';

    return newBot;
}

function getCurrentIndex(b) {
    var currentIndex = $(b).attr('id');
    currentIndex = currentIndex.split('_')[1];
    return currentIndex;
}

function findInRequestedBottles(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].productId === id) {
            return i;
        }
    }
    return null;
}

$(document).ready(function () {
    var bottles = [],
        requestedBottles = [],
        totalPrice = 0,
        bottlesGallery = $('.bottles-area'),
        itemToRemove,
        newBottle,
        currentIndex;

    $.getJSON('bottles.json', function (data) {
        $.each(data, function (i, obj) {
            bottles.push(obj);
        });

        for (var i = 0; i < bottles.length; i++) {
            newBottle = createNewBottle(i, bottles);
            bottlesGallery.append(newBottle);
        }
    });

    $(document).on('click', '.fa-cart-plus', function () {
        currentIndex = getCurrentIndex(this);
        requestedBottles.push({
            "title": bottles[currentIndex].title,
            "price": bottles[currentIndex].price,
            "productId": currentIndex
        });
        console.log(requestedBottles);
    });

    $(document).on('click', '.fa-minus-circle', function () {
        currentIndex = getCurrentIndex(this);

        itemToRemove = findInRequestedBottles(requestedBottles, currentIndex);
        if(itemToRemove !== null) {
            requestedBottles.splice(itemToRemove, 1);
            console.log(requestedBottles);
        }
    });
});