<?php

namespace App\Http\Controllers;

use App\Libs\TMBase;
use App\Libs\Almaty;
use App\Libs\Astana;
use Illuminate\Http\Request;

class ApiController extends Controller{
  public function __construct(Request $request){
    if($request->get('city') == 'Astana'){
      $this->city = new Astana();
    }else{
      $this->city = new Almaty();
    }
    $this->tm = new TMBase($this->city);
  }
  public function authenticate(Request $request){
    $login = $request->input('login');
    $password = $request->input('password');
    $local_password = $request->input('local_password');
    $city = $request->get('city');
    $authenticate = $this->tm->check_authorization($login,$password,$local_password);
    return json_encode($authenticate);
    if($authenticate){
      $client = new \stdClass();
      $client->id = $authenticate->client_id;
      $client->name = $this->tm->authorizate_customer($client->id,$local_password,$this->city->city);
      $client_info = $this->tm->get_client_info($client->id);
      if($client_info){
        $client->company = $client_info->name;
        $client->number = $client_info->number;
        $client->address = $client_info->address;
        $client->phones = $client_info->phones;
        $client->token = md5($client->id.$client->name);
        return json_encode($client);
      }else
        return json_encode(false);
    }else{
      return json_encode(false);
    }
    return json_encode(false);
  }
}