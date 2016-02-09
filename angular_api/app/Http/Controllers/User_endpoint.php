<?php

namespace App\Http\Controllers;

header("Access-Control-Allow-Origin: *");

use App\Http\Controllers\Controller;
use App\User;
use App\Column_order;
use Illuminate\Support\Facades\Input;

class User_endpoint extends Controller {

  public function getData() {
    
    $draw = Input::get('draw');

    if(Input::get('order') && Input::get('columns')) {
      $columns = Input::get('columns');
      $sort_cri = Input::get('order');
      if($sort_cri[0]) {
        $sort_field = $columns[$sort_cri[0]['column']]['data'];
        $sort_order = $sort_cri[0]['dir'];
      }
    }
    
    $length = Input::get('length');
    $start = Input::get('start');
    $search_fields_or_search_text = Input::get('searchFields');

    if (isset($limitFrom) && isset($rec_per_page) && isset($search_fields_or_search_text)) {
      if (is_array($search_fields_or_search_text)) {
        $usertotal_search_query = User::query();
        $userdata_search_query = User::query();
        foreach ($search_fields_or_search_text as $search_field => $search_value) {
          $totalUsers = $usertotal_search_query->where($search_field, 'LIKE', '%' . $search_value . '%');
          $users = $userdata_search_query->where($search_field, 'LIKE', '%' . $search_value . '%');
        }
        $totalUsers = $usertotal_search_query->count();

        $users = $userdata_search_query->skip($limitFrom)
                ->take($rec_per_page)
                ->get();
      } else {
        $user_fields = \Schema::getColumnListing('users');
        $usertotal_search_query = User::query();
        $userdata_search_query = User::query();
        foreach($user_fields as $user_field) {
          $totalUsers = $usertotal_search_query -> orWhere($user_field, 'LIKE', '%' . $search_fields_or_search_text . '%');
          $users = $userdata_search_query -> orWhere($user_field, 'LIKE', '%'. $search_fields_or_search_text . '%');
        }
        $totalUsers = $usertotal_search_query -> count();
        $users = $userdata_search_query -> skip($limitFrom)
        -> take($rec_per_page)
        -> get(); 
      }
    } else if (isset($start) && isset($length) && isset($sort_field) && isset($sort_order)) {
      $totalUsers = User::count();
      $users = User::orderBy($sort_field, $sort_order)
              ->skip($start)
              ->take($length)
              ->get();
    } else if (isset($start) && isset($length)) {
      $totalUsers = User::count();
      $users = User::skip($start)
              ->take($length)
              ->get();
    } else {
      $totalUsers = User::count();
      $users = User::all();
    }
    return ['draw' => (int)$draw, 'recordsFiltered' => $totalUsers, 'recordsTotal' => $totalUsers, 'data' => $users];
  }
  
  public function getUserColumnOrder() {
    if(Input::get('uid')) {
      $uid = Input::get('uid');
      $user_column_order = Column_order::where('uid', $uid, '=')->lists('column_order')->first();
      return json_encode(['user_column_order' => $user_column_order]);
    }
  }
}
