<?php

test('redirects home to jobs page', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('jobs.index'));
});