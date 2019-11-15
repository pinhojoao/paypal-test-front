function formatProduct(product) {
    return `<div class="col-sm-3"><div class="card" style="width: 18rem;">
        <img src="${product.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <a href="#" class="btn btn-primary add-to-cart-btn" product-id="${product.id}">Add to Cart</a>
        </div>
    </div></div>`;
}

function formatCartItem(item) {
    return `<tr>
                <th scope="row">${item.id}</th>
                <td>${item.name}</td>
                <td><input type="number" value="${item.qty}" class="update-qty form-control" product-id="${item.id}"></td>
                <td class="item-price">${item.price}</td>
                <td class="item-final">${item.qty * item.price}</td>
                <td><a href="#" class="remove-btn" product-id="${item.id}">Remove</a></td>
            </tr>`;
}

function getSummary() {
    let totalQty = 0;
    let totalFinal = 0;
    $('.update-qty').each(function(){
        totalQty += parseInt($(this).val());
    });
    $('.item-final').each(function(){
        totalFinal += parseFloat($(this).html());
    });
    $('#total_qty').html(totalQty);
    $('#total_final').html(totalFinal);
}

function updateCartList(cart, cartList = null) {
    if(!cartList)
        cartList = $('#cart-product-list');

    cartList.html('');
    $.each(cart, (i, item) => {
        cartList.append(formatCartItem(item));
    });

    getSummary();

    $('.update-qty').on('keyup', function(e) {
        let productId = $(this).attr('product-id');
        let qty = $(this).val();
        if(qty != '') {
            updateCart(productId, qty)
            .then((data) => {
                $('body').append(`<div class="alert alert-success alert-dismissible fade show paypal-store-alert" role="alert">
                <strong>Product quantity updated!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`);
                let parent = $(this).parent().parent();
                let price = parent.find('.item-price').html();
                console.log(price);
                let total = qty * price;
                parent.find('.item-final').html(total);
                updateCartCount(data);
                getSummary();
            })
            .catch((err) => {
                $('body').append(`<div class="alert alert-danger alert-dismissible fade show paypal-store-alert" role="alert">
                <strong>Error!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`);
                startCart();
            })
        }
    });

    $('.remove-btn').on('click', function(e) {
        let productId = $(this).attr('product-id');

        removeFromCart(productId).then((data) => {
            $('body').append(`<div class="alert alert-success alert-dismissible fade show paypal-store-alert" role="alert">
            <strong>Product removed from cart!</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`);
            updateCartCount(data);
            updateCartList(data);
        })
    });
}

function startCart() {
    getCart().then((data) => {
        cartData = data;
        updateCartCount(data);
        let cartList = $('#cart-product-list');
        if(cartList.length > 0) {
            updateCartList(data, cartList);
        }
    });
}

$().ready(function(){
    startCart();
    getProductList().then((data) => {
        $.each(data, (i, item) => {
            $('#products').append(formatProduct(item));
        });
    }).then(() => {
        $('.add-to-cart-btn').on('click', function(e) {
            let productId = $(this).attr('product-id');
            addToCart(productId)
                .then((data) => {
                    updateCartCount(data);
                })
                .then((data) => {
                    $('body').append(`<div class="alert alert-success alert-dismissible fade show paypal-store-alert" role="alert">
                    <strong>Product added to cart!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`);
                });
        });
    }).catch(() => alert("Erro"));
});
