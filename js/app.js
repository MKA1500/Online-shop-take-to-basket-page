// https://rawsawcoldpress.pl/zamow-soki/

function createNewBottle(index, items) {
    items[index].ingredients = items[index].ingredients.toString().replace(/,/g, ', ')
    var newBot = '<div class="col-md-6 col-lg-4 a-bottle">' +
        '<img src="' + items[index].pic + '" alt="green-velvet-juice"/>' +
        '<h5>' + items[index].title + '</h5>' +
        '<div class="price">' + items[index].price + ' zł</div>' +
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

function updateBottleImage(totalPrice, bottleImage) {
   var imageUrl = '';
    totalPrice = totalPrice / 16.5;
    switch (totalPrice) {
        case 0:
            imageUrl = "img/rawsaw-bootle-0.png";
            break;
        case 1:
            imageUrl = "img/rawsaw-bootle-1.png";
            break;
        case 2:
            imageUrl = "img/rawsaw-bootle-2.png";
            break;
        case 3:
            imageUrl = "img/rawsaw-bootle-3.png";
            break;
        case 4:
            imageUrl = "img/rawsaw-bootle-4.png";
            break;
        case 5:
            imageUrl = "img/rawsaw-bootle-5.png";
            break;
        default:
            imageUrl = "img/rawsaw-bootle-6.png";
    }
    bottleImage.attr('src', imageUrl);
}

function updatePurchaseTable(bArray, whereToAppend, bottleImage) {
    var tableRows = '',
        totalPrice = 0;

    for (var i = 0; i < bArray.length; i++) {
        tableRows = tableRows +
            '<tr>' +
            '<td>' + bArray[i].title +
            '<small>x' + bArray[i].amount +
            '</small></td>' +
            '<td>' + (bArray[i].amount * bArray[i].price).toFixed(2) +
            ' zł</td>' +
            '</tr>';

        totalPrice = totalPrice + (bArray[i].amount * bArray[i].price);
    }

    tableRows = tableRows +
        '<tr>' +
        '<td>Razem:</td>' +
        '<td>' + totalPrice.toFixed(2) + ' zł</td>' +
        '</tr>';

    whereToAppend.empty().append(tableRows);

    updateBottleImage(totalPrice, bottleImage);
}

$(document).ready(function () {
    var bottles = [],
        requestedBottles = [],
        bottlesGallery = $('.bottles-area'),
        tableBody = $('#order'),
        bottleImage = $('#filling-bottle'),
        itemToRemove,
        newBottle,
        currentIndex,
        sumSimilarItems;

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

        sumSimilarItems = findInRequestedBottles(requestedBottles, currentIndex);
        console.log(sumSimilarItems);

        if (sumSimilarItems === null) {
            requestedBottles.push({
                "title": bottles[currentIndex].title,
                "price": parseFloat(bottles[currentIndex].price),
                "productId": currentIndex,
                "amount": 1
            });
        } else {
            requestedBottles[sumSimilarItems].amount++;
        }
        console.log(requestedBottles);
        updatePurchaseTable(requestedBottles, tableBody, bottleImage);
    });

    $(document).on('click', '.fa-minus-circle', function () {
        currentIndex = getCurrentIndex(this);

        itemToRemove = findInRequestedBottles(requestedBottles, currentIndex);
        if (itemToRemove !== null) {
            if (requestedBottles[itemToRemove].amount > 1) {
                requestedBottles[itemToRemove].amount--;
            } else {
                requestedBottles.splice(itemToRemove, 1);
            }
        }
        console.log(requestedBottles);
        updatePurchaseTable(requestedBottles, tableBody, bottleImage);
    });
});