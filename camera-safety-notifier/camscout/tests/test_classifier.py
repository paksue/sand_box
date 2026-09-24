from camscout.classifier import classify


def test_camera_metadata_scores_high():
    score,reasons=classify(554,"RTSP Network Camera ONVIF")
    assert score >= .8
    assert reasons


def test_generic_http_does_not_look_like_camera():
    score,_=classify(80,"nginx")
    assert score < .3
