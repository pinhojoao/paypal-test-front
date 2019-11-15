var apiUri = "http://paypal-api.nxs/api";
function ajaxCall(method, url, data = null) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: method,
            url: apiUri + url,
            crossDomain: true,
            success: resolve,
            error: reject,
            data: data
        });
    });
}

function getProductList() {
    return ajaxCall('GET', '/products');
}

function addToCart(productId) {
    return ajaxCall('POST', '/cart', {product_id: productId});
}

function updateCart(productId, qty) {
    return ajaxCall('POST', '/cart', {_method: 'PUT', product_id: productId, qty: qty});
}

function removeFromCart(productId) {
    return ajaxCall('POST', '/cart', {_method: 'DELETE', product_id: productId});
}

function getCart() {
    return ajaxCall('GET', '/cart');
}

function getUser() {
    return ajaxCall('GET', '/user');
}

function updateCartCount(cart) {
    let totalItens = cart.reduce((sum, item) => { return sum + item.qty }, 0);
    $('#cart-itens').html(totalItens);
}
