# README #
This is experimental app. This app is using LTA DataMall API to get the bus service information.
The documentation about the api can be found here: https://www.mytransport.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf

### Development setup ###

* start React Native packager
    * run "npm start" in project root directory    


* run iOS or Android project using official IDE 
    * iOS: 
        * install watchmen for faster react packager file lookup - https://facebook.github.io/watchman/
        * simply double click ios/ReebonzMobileApp.xcodeproj, this will open XCode
        * run the project
    * Android: 
        * launch Android Studio
        * in Welcome screen, choose "Import project", and select the whole android directory
        * (optional, but recommended) install Genymotion Android simulator [link](https://www.genymotion.com/)
        * run the project
        * if you are having problems with packager now reloading JS, following instructions here to increase node-haste timeout: https://github.com/facebook/react-native/issues/7257


# Issues

- If you are encountering a "fs operation timeout" thrown by packager, up the FS_OP_TIMEOUT config

https://github.com/facebook/react-native/commit/8edb9524035b0c034135a81551ba955ee514dbd4

- Error when running watchman

https://github.com/facebook/react-native/issues/3199

echo 256 | sudo tee -a /proc/sys/fs/inotify/max_user_instances
echo 32768 | sudo tee -a /proc/sys/fs/inotify/max_queued_events
echo 524288 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
watchman shutdown-server

- If you're using linux 64bit, you may encounter error while running ```run-android``` with vague error:

```
...
> com.android.ide.common.process.ProcessException: Failed to execute aapt
```

To further investigate this, run:

```
$ cd android && ./gradlew assembleDevDebug --debug --stacktrace
```

if you encounter BUILD FAILED with the following error:

```
...
Error: Cannot run program "/opt/android-sdk/build-tools/23.0.1/aapt": java.io.IOException: error=2, No such file or directory
```

Then you are missing a couple 32-bit libraries

```
sudo apt-get install lib32stdc++6 lib32z1
```

Reference: [Android studio cannot find aapt](http://stackoverflow.com/questions/18928164/android-studio-cannot-find-aapt/18930424#18930424)
