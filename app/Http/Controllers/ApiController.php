<?php

namespace App\Http\Controllers;

use App\Libs\TMBase;
use App\Libs\Almaty;
use App\Libs\Astana;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class ApiController extends Controller{
  public function __construct(Request $request){
    if($request->get('city') == 'Astana' || $request->get('city') == 2){
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
        $request->session()->put('token', $client->token);
        return json_encode($client);
      }else
        return json_encode(false);
    }else{
      return json_encode(false);
    }
    return json_encode(false);
  }

  public function createOrder(Request $request){
    $source_coords = $request->get('source_coords');
    $dest_coords = $request->get('dest_coords');
    $source_time = $request->get('stime');
    $phone = $request->get('phone');
    $passenger = $request->get('passenger');
    $comment = $request->has('comment') ? $request->get('comment') : null;
    $tm = new TMBase($this->city);
    if(isset($source_coords) && isset($dest_coords) && isset($source_time) && isset($phone) && isset($passenger)){
      return json_encode(1522685);
    }else{
      return json_encode(false);
    }
  }
  public function sendMail(Request $request){
    $email = $request->get('email');
    $order_id = $request->get('order_id');
    if(isset($email) && isset($order_id)){
      return json_encode(true);
    }else{
      return json_encode(false);
    }
  }
  public function getToken(Request $request){
    return $request->session->get('token');
  }
  public function currentOrders(Request $request,$id){
    if(empty($id))
      return json_encode(false);
    $result = $this->tm->getCurrentOrders($id);
    if(is_array($result)){
      return json_encode($result);
    }else{
      return json_encode(false);
    }
  }

  public function history(Request $request){
    $begin = $request->get('begin');
    $end = $request->get('end');
    $id = $request->get('id');
    $data = [
      'client_id'=>$id,
      'start_time'=>$begin,
      'finish_time'=>$end
    ];
    $res = $this->tm->get_history($data);
    return response()->json($res);
  }

  public function feedback(Request $request){
    $hasName = $request->has('name');
    $hasEmail = $request->has('email');
    $hasComment = $request->has('comment');

    if($hasName && $hasEmail && $hasComment)
      return response()->json(true);
    else
      return response()->json(false);
  }
}