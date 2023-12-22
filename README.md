# smart-mentions

```php
/**
 * Laravel Mention Notifications Example
 *
 * This example demonstrates how to integrate mention parsing and notification functionalities
 * within the Laravel framework. The provided code showcases methods for parsing mentions
 * in a note field and sending notifications to users mentioned in the note. Feel free to
 * adapt the code to fit your Laravel application's requirements.
 */
use YourVendor\Helpers\Helper;
use YourVendor\Models\Notification;

// Parse mentions in a text
$text = "Hello, [@John Doe](user:1)! How are you?";
$parsedText = Helper::parseMentions($text);

// Get an array of mentioned user IDs
$mentionedIds = Helper::getMentionedIds($text);
foreach ($mentioneds as $mentionedId) {
    Notification::create([
        'receiver_id' => $mentionedId,
        'content' => 'You have received a new mention!'
    ]);
}

// Here, an example of the structure is given in the helper class
public static function parseMentions($text)
{
    $text = preg_replace('/\[(.)(.+?)\]\((\w+):(.+?)\)/', '<span class="mention label" style="font-size:90%;"><span class="member-trigger">@</span><span class="member-value">$2</span></span>', $text);

    return $text;
}

public static function getMentionedIds($text)
{
    preg_match_all('/\[(.)(.+?)\]\((\w+):(.+?)\)/', $text, $matches);

    if (isset($matches[4])) {
        return $matches[4];
    }

    return [];
}