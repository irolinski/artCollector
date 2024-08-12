"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
$(document).ready(function () {
    let table = $("#collection-table").DataTable({
        columnDefs: [{ orderable: false, targets: [2, 3] }],
        order: [[5, "desc"]],
        language: {
            paginate: {
                previous: "&#8810;",
                next: "&#8811;",
            },
        },
        searching: true,
    });
    $("#table-search").keyup(function () {
        table.search($(this).val()).draw();
    });
    $("#length_change").val(table.page.len());
    $("#length_change").change(function () {
        table.page.len($(this).val()).draw();
    });
});
//# sourceMappingURL=dataTables_settings.js.map