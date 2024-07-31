var productModal = $("#productModal");

$(function () {
    // JSON data by API call
    $.get(productListApiUrl, function (response) {
        if(response) {
            var table = '';
            $.each(response, function(index, product) {
                table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                    '<td>'+ product.name +'</td>'+
                    '<td>'+ product.uom_name +'</td>'+
                    '<td>'+ product.price_per_unit +'</td>'+
                    '<td>' +
                        '<span class="btn btn-xs btn-warning edit-product">Edit</span> ' +
                        '<span class="btn btn-xs btn-danger delete-product">Delete</span>' +
                    '</td></tr>';
            });
            $("table").find('tbody').empty().html(table);
        }
    });

    // Save Product
    $("#saveProduct").on("click", function () {
        var data = $("#productForm").serializeArray();
        var requestPayload = {
            product_id: $('#id').val(), // Include product_id for edit
            product_name: null,
            uom_id: null,
            price_per_unit: null
        };
        for (var i = 0; i < data.length; ++i) {
            var element = data[i];
            switch(element.name) {
                case 'name':
                    requestPayload.product_name = element.value;
                    break;
                case 'uoms':
                    requestPayload.uom_id = element.value;
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value;
                    break;
            }
        }
        var apiUrl = productSaveApiUrl;
        if (requestPayload.product_id && requestPayload.product_id !== '0') {
            var updateProductApiUrl = '/updateProduct';
            apiUrl = updateProductApiUrl; // Use update API if product_id is set
        }
        callApi("POST", apiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });

    $(document).on("click", ".edit-product", function () {
        var tr = $(this).closest('tr');
        var productId = tr.data('id');
        var productName = tr.data('name');
        var productUnit = tr.data('unit');
        var productPrice = tr.data('price');

        $("#id").val(productId);
        $("#name").val(productName);
        $("#price").val(productPrice);
        productModal.find('.modal-title').text('Edit Product');

        // Populate unit options first, then set the value
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);

                // Set the selected unit value
                $("#uoms").val(productUnit);

                // Show the modal after populating the units
                productModal.modal('show');
            }
        });
    });

    $(document).on("click", ".delete-product", function () {
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #uoms, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        // JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });
});
