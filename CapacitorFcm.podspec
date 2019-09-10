
  Pod::Spec.new do |s|
    s.name = 'CapacitorFcm'
    s.version = '0.0.7'
    s.summary = 'Enable Firebase Cloud Messaging features for Capacitor apps'
    s.license = 'MIT'
    s.homepage = 'https://github.com/stewwan/capacitor-fcm'
    s.author = 'Stewan Silva'
    s.source = { :git => 'https://github.com/stewwan/capacitor-fcm', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
    s.dependency 'Firebase'
    s.dependency 'FirebaseCore'
    s.dependency 'FirebaseMessaging'
    s.static_framework = true
  end