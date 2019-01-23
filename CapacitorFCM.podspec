
  Pod::Spec.new do |s|
    s.name = 'CapacitorFCM'
    s.version = '0.0.1'
    s.summary = 'bring firebase cloud messaging feature to capacitor'
    s.license = 'MIT'
    s.homepage = 'https://github.com/stewwan/capacitor-fcm'
    s.author = 'Stewan Silva'
    s.source = { :git => 'https://github.com/stewwan/capacitor-fcm', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
    s.dependency 'FirebaseMessaging'
    s.dependency 'FirebaseCore'
    s.dependency 'FirebaseAnalytics'
    s.dependency 'FirebaseInstanceID'
    s.static_framework = true
  end