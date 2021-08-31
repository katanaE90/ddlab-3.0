<?php

use Klein\Klein;

Class Router
{

    public function __construct($config)
    {
        spl_autoload_register(array($this, 'autoload_classes'));
        $this->config = $config;
        $this->klein = new Klein();
        $this->requests();
        Model::setStat();
        $this->renderPages();
        $this->klein->dispatch();
    }
    private $config;

    public function autoload_classes($class_name)
    {
        $filePath = str_replace('_', '/', $class_name);
        $modelFile = APP . 'models/' . $filePath . '.php';
        if (file_exists($modelFile)) {
            require_once $modelFile;
        }
    }

    public function renderPages()
    {
        $this->klein->respond('GET', '/', function ($request, $response, $service) {
            $service->render(PUB . 'views/index.phtml', $this->config);
            return;
        });
        $this->klein->respond('GET', '/[:href]', function ($request, $response, $service) {
            $page = Model::getPage($request->href);
            if ($page === NULL) $page = Model::getCourse($request->href);
            if ($page === NULL) $page = 'error';
            $service->render(PUB . 'views/' . $page . '.phtml', $this->config);
            return;
        });
        $this->klein->respond('GET', '', function ($request, $response, $service) {
            $service->render(PUB . 'views/error.html');
            return;
        });
    }

    public function requests()
    {
        $this->klein->respond('POST', '/v1/[:action]', function ($request, $response, $service, $app, $db) {
            $result = "error";
            switch ($request->action) {
                case "getMainPage":
                    $result = Model::getIndex();
                    break;
                case "getNavigation":
                    $result = Model::getMainMenu();
                    break;
                case "getCourse":
                    $result = Model::getCourseDescription();
                    break;
                case "setMainPage":
                    $result = Model::setMainPage();
                    break;
                case "setCoursePage":
                    $result = Model::setCoursePage();
                    break;
                case "sendMail":
                    $result = Model::sendMail();
                    break;
            }
            $send = $request->param('format', 'json');
            $response->$send($result);
            return;
        });
    }
}