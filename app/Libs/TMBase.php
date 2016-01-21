<?php
/**
 * Created by PhpStorm.
 * User: ernar
 * Date: 10/9/15
 * Time: 10:14 PM
 */

namespace App\Libs;

class TMBase {
    private $host;
    private $port;
    private $secret_key;

    public function __construct($city){
        $this->city = $city;
        $this->host = $city->tm_host;
        $this->port = $city->tm_port;
        $this->secret_key = $city->secret_key;
    }
    private function call_get($method, $params=false){

        if($params!=false)
            $q_p=http_build_query($params);
        else
            $q_p = false;

        $ch = curl_init($this->host);
        $uri = $this->host.':'.$this->port. '/common_api/1.0/' . $method . '?' . $q_p;
        $headers = [
            'Signature: ' . md5($q_p . $this->secret_key),
            'Content-Type: application/x-www-from-urlencoded',
        ];
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        curl_close($ch);
        return !empty($response) ? $response : false;
    }
    public function authorizate_customer($client, $customer_password, $gorod)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,
            "http://komandirtaxi.no-ip.biz:4055/execsvcscriptplain/?name=get_customer_info&startparam1=" .
            $client . "&startparam2=" . $customer_password . "&startparam3=" . $gorod .
            "&async=0&timeout=10");
        curl_setopt($ch, CURLOPT_POST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $response = curl_exec($ch);
        $error_code = curl_errno($ch);
        curl_close($ch);

        return $response;
    }
    public function get_client_info($id){
        $q_p = [
            'client_id' => (int)$id
        ];
        $response = json_decode($this->call_get('get_client_info',$q_p));
        if($response->code == 0)
            return $response->data;
        else
            return false;
    }
    private function call_post($method, $params = false)
    {
        $q_p = json_encode($params);
        $ch = curl_init();
        $uri = $this->host.':'.$this->port . '/common_api/1.0/' . $method;
        $headers = [
            'Signature: ' . md5($q_p . $this->secret_key),
            'Content-Type: application/json'
        ];
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $q_p);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        return !empty($response) ? $response : false;
    }
    public function check_authorization($login,$password,$local_password){
        $q_p = [
            'login' => $login,
            'password' => $password,
        ];
        $response = json_decode($this->call_get('check_authorization',$q_p));
        if($response->code == 0 && isset($response->data->client_id))
            return $response->data;
        else
            return false;
    }
    public function test(){
        $q = [
            'driver_id'=>224,
            'oper_sum'=>1.0,
            'oper_type'=>'expense',
        ];
        return $this->call_post('create_driver_operation',$q);
    }
    public function get_all_crews(){
        $a = [
            'not_working_crews'=>'true'
        ];
        return $this->call_get('get_crews_info',$a);
        return json_decode($this->call_get('get_crews_info',$a))->data->crews_info;
    }
    public function get_online_crews(){
        $a = [
            'not_working_crews'=>'false'
        ];
        return json_decode($this->call_get('get_crews_info'));
    }
    public function get_drivers_info(){
        return json_decode($this->call_get('get_drivers_info',['locked_drivers'=>'true']));
    }
    public function get_cars_info(){
        $a = [
            'locked_cars'=>'true',
        ];
        return json_decode($this->call_get('get_cars_info',$a))->data->crews_info;
    }
    public function get_crew_coords(){
        $a = [];
        return json_decode($this->call_get('get_crews_coords'))->data->crews_coords;
    }
    public function update_order(array $params){
        return json_decode($this->call_post('update_order',$params));
    }
    public function getCurrentOrders($client_id){
        $q_p = [
            'client_id' => (int)$client_id,
        ];
        $response = json_decode($this->call_get('get_current_orders',$q_p));
        if($response->code == 0){
            return $response->data->orders;
        }else{
            return false;
        }
    }
} 