var app = angular.module('pagination', ['ngAnimate', 'ngResource', 'datatables', 'datatables.colreorder', 'datatables.buttons']);
app.constant('END_POINT', 'angular_api/public');
app.controller('PaginationDemoCtrl', function (END_POINT, $resource, $scope, $log, DTOptionsBuilder, DTColumnBuilder, GetUserColumnOrder) {

  $scope.userColumnOrder = [
    {field: "id", title: "ID"},
    {field: "first_name", title: "First Name"},
    {field: "last_name", title: "Last Name"},
    {field: "address", title: "Address"},
    {field: "phone_no", title: "Phone no"},
    {field: "email", title: "Email"}
  ];

  $scope.userNewColumnOrder = [];
  $scope.dtColumns = [];
  
  $scope.expandDetails = function(ele, data) {
    if(angular.element(ele).hasClass('expanded')) {
      angular.element(ele).closest('tr').next('tr.more-info').remove();
      angular.element(ele).removeClass('expanded');
    } else {
      angular.element(ele).addClass('expanded');
      var moreInfoHTML = '<tr class="more-info">';
      moreInfoHTML += '<td colspan="8">';
      moreInfoHTML += '<table width="100%"><tbody>';
      moreInfoHTML += '<tr><td>First name: ' +  data.first_name + '</td></tr>';
      moreInfoHTML += '<tr><td>Last name: ' +  data.last_name + '</td></tr>';
      moreInfoHTML += '<tr><td>Full name: ' +  data.name + '</td></tr>';
      moreInfoHTML += '<tr><td>Created at: ' + data.created_at + '</td></tr>';
      moreInfoHTML += '<tr><td>Updated at: ' + data.updated_at + '</td></tr>';
      moreInfoHTML += '<tr><td>Address: ' + data.address + '</td></tr>';
      moreInfoHTML += '</tbody></table>';
      moreInfoHTML += '</td>';
      moreInfoHTML += '</tr>';
      angular.element(ele).closest('tr').after(moreInfoHTML);
    }
  };

  $scope.dtOptions = DTOptionsBuilder.newOptions()          
          .withOption('ajax', {
            url: END_POINT + '/getdata',
            type: 'POST',
            isArray: false
          })
          .withColReorder()
          .withOption('searching', false)
          .withOption('bInfo', false)
          .withOption('lengthMenu', [5, 10, 25, 50, 75, 100])
          .withDataProp('data')
          .withOption('processing', true)
          .withOption('serverSide', true)
          .withPaginationType('full_numbers')
          .withButtons([
            'colvis'
          ])
          .withColReorderCallback(function () {
            $scope.userNewColumnOrder = [];
            var newColOrder = this.fnOrder();
            angular.forEach(newColOrder, function (column) {
              $scope.userNewColumnOrder.push($scope.userColumnOrder[column]);
            });
          })
          .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            angular.element(nRow).find('.more').unbind('click');
            angular.element(nRow).find('.more').bind('click', function() {
                $scope.expandDetails(this, aData);
            });
            return nRow;
          });
          
  angular.forEach($scope.userColumnOrder, function (value) {
    $scope.dtColumns.push(DTColumnBuilder.newColumn(value.field).withTitle(value.title));
  });
    
  $scope.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('More').notSortable().
    renderWith(function(data, type, full, meta) {
      return '<button class="more">More</button>';
    }));
  
  GetUserColumnOrder.query().$promise.then(function (res) {
    //console.log(res);
  }).catch(function (err) {
    $log.error(err);
  });
});
app.factory('GetUserColumnOrder', function ($resource, END_POINT) {
  return $resource(END_POINT + '/getuserorder', {uid: 1}, {
    'query': {
      method: 'POST',
      isArray: false
    }
  });
});
