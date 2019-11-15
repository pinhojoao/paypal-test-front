function setUser(user) {
    $('#first_name').val(user.first_name);
    $('#last_name').val(user.last_name);
    $('#email').val(user.email);
    $('#phone_number').val(user.phone_number);
    $('#state').val(user.state);
    $('#city').val(user.city);
    $('#zip').val(user.zip);
    $('#address').val(user.address);
    $('#country').val(user.country);
}

function formatCartItemCheckout(item) {
    return `<tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td class="item-price">${item.price}</td>
                <td class="item-final">${item.qty * item.price}</td>
            </tr>`;
}

$().ready(function(){
    getCart()
        .then((data) => {
            let totalPrice = 0;
            let totalQty = 0;
            let totalFinal = 0;
            $.each(data, (i, item) => {
                totalPrice += parseFloat(item.price);
                totalQty += parseFloat(item.qty);
                totalFinal += parseFloat(item.price * item.qty);
                $('#cart-product-list-checkout').append(formatCartItemCheckout(item));
            });
            $('#total_qty').html(totalQty);
            $('#total_final').html(totalFinal);

            updateCartCount(data);
        });
    getUser()
        .then((data) => { setUser(data) });
});
