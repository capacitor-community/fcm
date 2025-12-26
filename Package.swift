// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorCommunityFcm",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorCommunityFcm",
            targets: ["CapacitorCommunityFcmC", "CapacitorCommunityFcmSwift"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", "11.6.0"..<"12.0.0"),
    ],
    targets: [
        .target(
            name: "CapacitorCommunityFcmC",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm")
            ],
            path: "ios/Plugin",
            sources: [
                "Plugin.h",
                "Plugin.m"
            ],
            publicHeadersPath: "."
        ),
        .target(
            name: "CapacitorCommunityFcmSwift",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "FirebaseMessaging", package: "firebase-ios-sdk")
            ],
            path: "ios/Plugin",
            sources: [
                "Plugin.swift"
            ]
        ),
        .testTarget(
            name: "CapacitorCommunityFcmTests",
            dependencies: ["CapacitorCommunityFcmSwift"],
            path: "ios/PluginTests"
        )
    ]
)
