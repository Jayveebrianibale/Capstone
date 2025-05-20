<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster used by the framework
    | when an event needs to be broadcast. Set this to one of the connections
    | below: "pusher", "ably", "redis", "log", "null".
    |
    */

    'default' => env('BROADCAST_DRIVER', 'null'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Define all broadcast connections used to broadcast events to other systems
    | or over WebSockets.
    |
    */

    'connections' => [

      'pusher' => [
                'driver' => 'pusher',
                'key' => env('PUSHER_APP_KEY'),
                'secret' => env('PUSHER_APP_SECRET'),
                'app_id' => env('PUSHER_APP_ID'),
                'options' => [
                    'cluster' => env('PUSHER_APP_CLUSTER'),
                    'useTLS' => false,
                    'host' => env('PUSHER_HOST', '127.0.0.1'),
                    'port' => env('PUSHER_PORT', 6001),
                    'scheme' => env('PUSHER_SCHEME', 'http'),
                    'encrypted' => false,
                ],
                'client_options' => [
                    // Optional Guzzle HTTP client options
                ],
            ],


        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
