<?php
// Puli sa Code.gs: checkComment() + pag-save sa XAMPP MySQL
session_start();
header("Content-Type: application/json; charset=utf-8");

require "Words.php";
require "db.php";

// Turns a word into a pattern that also catches stretched spelling.
// "fuck" matches "fuuuck", but "ass" will not match "as".
function build_pattern($word) {
  $parts = explode(" ", $word);
  $bodies = [];
  foreach ($parts as $part) {
    $bodies[] = preg_replace_callback('/([a-z0-9])\1*|./s', function ($m) {
      if (isset($m[1]) && $m[1] !== "") {
        return $m[1] . "{" . strlen($m[0]) . ",}";
      }
      return preg_quote($m[0], "~");
    }, $part);
  }
  return "~(^|\\s)" . implode("\\s+", $bodies) . "(?=\\s|$)~i";
}

function check_comment($comment) {
  if (trim($comment) === "") {
    return ["status" => "EMPTY", "message" => "Please enter a comment first.", "detected" => []];
  }

  // Word lists live in Words.php
  $allWords = array_unique(array_merge(ENGLISH_WORDS, TAGALOG_WORDS, BISAYA_WORDS));

  // Normalize: lowercase, swap common symbol/number tricks (b1tch, sh1t, @ss)
  $normalized = mb_strtolower($comment, "UTF-8");
  $normalized = strtr($normalized, [
    "@" => "a", "$" => "s", "0" => "o", "1" => "i",
    "3" => "e", "4" => "a", "5" => "s", "7" => "t",
  ]);
  $normalized = preg_replace('/[^a-z\s]/', ' ', $normalized);
  $normalized = trim(preg_replace('/\s+/', ' ', $normalized));

  // Find matching words and phrases (no duplicates)
  $detected = [];
  foreach ($allWords as $word) {
    if (preg_match(build_pattern($word), $normalized)) {
      $detected[] = $word;
    }
  }

  if (count($detected) > 0) {
    return [
      "status" => "WARNING",
      "message" => "Potentially harmful language detected. Please review your comment before posting.",
      "detected" => $detected,
    ];
  }

  return [
    "status" => "SAFE",
    "message" => "No words from our current screening list were detected. Your comment passed the initial screening!",
    "detected" => [],
  ];
}

// Kuhaon ang user: 01_user, 02_user, ... (bag-ong code kada bag-ong name)
function get_user_code($conn, $name) {
  if (!empty($_SESSION["user_code"]) && ($_SESSION["user_name"] ?? "") === $name) {
    return $_SESSION["user_code"];
  }
  $stmt = $conn->prepare("INSERT INTO users (user_code, user_name) VALUES ('', ?)");
  $stmt->bind_param("s", $name);
  $stmt->execute();
  $id = $conn->insert_id;
  $code = sprintf("%02d_user", $id);
  $stmt = $conn->prepare("UPDATE users SET user_code = ? WHERE id = ?");
  $stmt->bind_param("si", $code, $id);
  $stmt->execute();
  $_SESSION["user_code"] = $code;
  $_SESSION["user_name"] = $name;
  return $code;
}

$comment = $_POST["comment"] ?? "";
$name = mb_substr(trim($_POST["name"] ?? ""), 0, 50, "UTF-8");

if ($name === "") {
  echo json_encode([
    "status" => "EMPTY",
    "message" => "Please enter your name first.",
    "detected" => [],
    "saved" => false,
  ]);
  exit;
}

$res = check_comment($comment);
$res["saved"] = false;

if ($res["status"] !== "EMPTY") {
  $conn = db_connect();
  if ($conn === null) {
    $res["db_error"] = "Dili ma-connect sa database. I-check ang port ug user sa db.php.";
  } else {
    $userCode = get_user_code($conn, $name);
    $result = $res["status"] === "SAFE" ? "good" : "bad";
    $detectedText = implode(", ", $res["detected"]);

    $stmt = $conn->prepare(
      "INSERT INTO comments (user_code, user_name, comment, result, detected_words) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sssss", $userCode, $name, $comment, $result, $detectedText);

    if ($stmt->execute()) {
      $res["saved"] = true;
      $res["user_code"] = $userCode;
    } else {
      $res["db_error"] = "Wala ma-save: " . $stmt->error;
    }
    $conn->close();
  }
}

echo json_encode($res, JSON_UNESCAPED_UNICODE);
