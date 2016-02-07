<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->welcome();
});

$app->get('/authenticate', 'ApiController@authenticate');
$app->post('/authenticate', 'ApiController@authenticate');
$app->post('/create_order', 'ApiController@createOrder');
$app->post('/send_mail', 'ApiController@sendMail');
$app->get('/token','ApiController@getToken');
$app->get('/current_orders/{id}','ApiController@currentOrders');
$app->post('/history','ApiController@history');
$app->post('/feedback','ApiController@feedback');