<?php

use \Database;

class Model
{
    public static function getIndex()
    {
        $db = new Database\DB();
        $query = "SELECT id, title, subtitle, href, age_min, age_max, duration, course_program, description, price, backgrounds, head_title, cat FROM courses where enabled = 1";
        $courses = $db::mysql()->query($query)->fetchAll();
        $query = "SELECT id, title, description FROM courses_cats where enabled = 1";
        $cats = $db::mysql()->query($query)->fetchAll();
        $sortedCourses = [];
        foreach ($courses as &$course) {
            $sortedCourses[$course->cat][] = $course;
        }
        foreach ($cats as &$cat) {
            $cat->courses = $sortedCourses[$cat->title];
        }
        $result['cats'] = $cats;
        return $result;
    }

    public static function getPage($href)
    {
        $db = new Database\DB();
        $query = "SELECT page FROM pages WHERE href = '$href'";
        $page = $db::mysql()->query($query)->fetchAll();
        $page = $page[0]->page;
        return $page;
    }

    public static function getCourse($href)
    {
        $db = new Database\DB();
        $query = "SELECT page FROM courses WHERE href = '$href'";
        $page = $db::mysql()->query($query)->fetchAll();
        $page = $page[0]->page;
        return $page;
    }

    public static function getMainMenu()
    {
        $db = new Database\DB();
        $query = "SELECT title, href FROM pages";
        $result['navigation'] = $db::mysql()->query($query)->fetchAll();
//        $page = $page[0]->page;
        return $result;
    }

    public static function getCourseDescription()
    {
        $params = $_POST;
        $lang = $params['lang'];
        $href = $params['courseName'];
        $db = new Database\DB();
        $query = "SELECT id, title, subtitle, age_min, age_max, duration, course_program, description, price, backgrounds, head_title, cat FROM courses where enabled = 1 AND lang = '$lang' AND href =  '$href'";
        $courseDescription = $db::mysql()->query($query)->fetchAll();
        $courseDescription = $courseDescription[0];
        return $courseDescription;
    }

    public static function setMainPage()
    {
        $db = new Database\DB();
        $data = json_decode($_POST['data'], true);
        foreach ($data as $datum) {
            $id = (int)$datum['id'];
            $title = $datum['title'];
            $description = $datum['description'];
            if ($description && $title !== NULL) {
                $query = "UPDATE courses_cats SET title='$title', description='$description' where id='$id'";
                $db::mysql()->query($query)->fetch();
            }
        }
        $err = $db::mysql()->getLastError();
        $result = 'unsuccess';
        if ($err === '') {
            $result = 'success';
        }
        return $result;
    }

    public static function setCoursePage()
    {
        $db = new Database\DB();
        $data = json_decode($_POST['data'], true);
//        echo "<br><br><br><br>";
//        var_dump($_POST['data']);
//        exit;
        $id = (int)$data["id"];
        $title = $data["title"];
        $subtitle = $data["subtitle"];
        $age_min = (int)$data["age_min"];
        $age_max = (int)$data["age_max"];
        $duration = (int)$data["duration"];
        $course_program = $data["course_program"];
        $description = json_encode($data["description"], JSON_UNESCAPED_UNICODE);
        $price = (int)$data["price"];
        $backgrounds = $data["backgrounds"];
        $head_title = $data["head_title"];
        $result = 'unsuccess';

        if (is_null($data)) {
            return $result;
        }
        foreach ($data as $datum) {
            if (is_null($datum)) return $result;
        }

        $query = "UPDATE courses SET title='$title', subtitle='$subtitle', age_min='$age_min', age_max='$age_max'," .
            " duration='$duration', course_program='$course_program', description='$description', price='$price', " .
            "backgrounds='$backgrounds', head_title='$head_title' where id='$id'";

        $db::mysql()->query($query)->fetch();
        $err = $db::mysql()->getLastError();
//        var_dump($err);
        if ($err === '') {
            $result = 'success';
        }
        return $result;
    }

    public static function sendMail()
    {
        $data = json_decode($_POST['data'], true);
        $href = $data['href'];
        $db = new Database\DB();
        $query = "SELECT title, cat FROM courses where href =  '$href'";
        $course = $db::mysql()->query($query)->fetchAll();
        $course = $course[0];
        $to = 'nikolayddl@gmail.com';
        $to .= ', ddlaboratory.pro@gmail.com';
        $subject = 'Заявка с сайта';
        $message = 'Имя/Фамилия: ' . $data['name'] . "\n";
        $message .= 'Email: ' . $data['email'] . "\n";
        $message .= 'Номер телефона: ' . $data['phone'] . "\n";
        $message .= 'Возраст: ' . $data['age'] . "\n";
        if ($course !== NULL) {
            $message .= 'Просмотренный курс: ' . $course->title . "\n";
            $message .= 'Напрвление: ' . $course->cat . "\n";
        } else {
            $message .= 'Регистрация с главной страницы.';
        }

        $headers = array(
            'From' => 'ddlaboratory@gmail.com',
            'X-Mailer' => 'PHP/' . phpversion()
        );

        $success = mail($to, $subject, $message, $headers);
        if (!$success) {
            $errorMessage = error_get_last()['message'];
            return "unsuccess";
        }
        return "success";

    }

    public static function setStat()
    {
        $db = new Database\DB();

        $referer = $_SERVER['HTTP_REFERER'];
        $referer = preg_replace('~https?://(www\.)?~', '', $referer);
        $referer = explode('/', $referer)[0];
        $ip = $_SERVER['REMOTE_ADDR'];
        if (preg_match('~ddlaboratory\.pro~', $referer) || strlen($referer) < 1) {
            return true;
        }
        $query = "INSERT INTO statistics (ip, referer) VALUES ('$ip', '$referer')";
        $db::mysql()->query($query)->fetch();
        $err = $db::mysql()->getLastError();
        $result = 'unsuccess';
        if ($err === '') {
            $result = 'success';
        }
        return $result;
    }


}