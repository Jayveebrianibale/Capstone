<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class TestWebSocketEvent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct($message = 'Hello from Laravel WebSocket!')
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('test-channel'); // Use "PrivateChannel" if authentication is needed
    }

    public function broadcastAs()
    {
        return 'test-event'; // Event name you will listen for on the frontend
    }
}
