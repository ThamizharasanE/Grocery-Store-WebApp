$(function () {
    // Json data by API call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalCost = 0;

            $.each(response, function(index, order) {
                totalCost += parseFloat(order.total);

                // Order row
                table += '<tr class="order-item">' +
                    '<td class="toggle-button" id="toggle-' + order.order_id + '">' +
                        '<i class="fas fa-chevron-down"></i>' +
                    '</td>' +
                    '<td>' + order.order_id + '</td>' +
                    '<td>' + new Date(order.datetime).toLocaleDateString() + '</td>' +
                    '<td>' + order.customer_name + '</td>' +
                    '<td>' + order.total.toFixed(2) + ' Rs</td>' +
                    '</tr>';

                // Order details row
                table += '<tr class="order-details" id="order-details-' + order.order_id + '">' +
                    '<td colspan="5">' +
                        '<table class="table table-bordered">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th>Product Name</th>' +
                                    '<th>Price Per Unit</th>' +
                                    '<th>Quantity</th>' +
                                    '<th>Total Price</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                                $.map(order.order_details, function(detail) {
                                    return '<tr>' +
                                        '<td>' + detail.product_name + '</td>' +
                                        '<td>' + detail.price_per_unit + '</td>' +
                                        '<td>' + detail.quantity + '</td>' +
                                        '<td>' + detail.total_price + '</td>' +
                                    '</tr>';
                                }).join('') +
                            '</tbody>' +
                        '</table>' +
                    '</td>' +
                '</tr>';
            });

            table += '<tr><td colspan="4" style="text-align: end"><b>Total</b></td><td><b>' + totalCost.toFixed(2) + ' Rs</b></td></tr>';
            $("table").find('tbody').empty().html(table);

            // Add click event listener to toggle button
            $('.order-item').click(function() {
                var orderId = $(this).find('.toggle-button').attr('id').split('-')[1];
                toggleDetails(orderId);
            });
        }
    });

    function toggleDetails(orderId) {
        var detailsElement = $('#order-details-' + orderId);
        var toggleButton = $('#toggle-' + orderId);
        if (detailsElement.is(':visible')) {
            detailsElement.hide();
            toggleButton.removeClass('expanded').html('<i class="fas fa-chevron-down"></i>');
        } else {
            detailsElement.show();
            toggleButton.addClass('expanded').html('<i class="fas fa-chevron-up"></i>');
        }
    }
});
