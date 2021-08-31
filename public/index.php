<?php
//header("Content-type: application/json");
header("Access-Control-Allow-Origin: http://localhost:63343");

require_once __DIR__ . '/../vendor/autoload.php';
define('APP', __DIR__ . "/../app/");
define('PUB', __DIR__ . "/../public/");
require_once APP . '../config/config.php';
require_once APP . 'db/db_new.php';
require_once APP . '/router/Router.php';
new Router($config);