---
title: Applying Subtitles
menu:
  docs:
    parent: working-with-subtitles
weight: 3200
aliases:
  - /docs/latest/Attaching_subtitles_to_video/
---

In digital encoding, there are two main ways of including subtitles in a video:
softsubbing and hardsubbing. Both methods has unique advantages and
disadvantages, along with various arguments both for and against each method.

## Hardsubbing

Hardsubbing is a method that "burns in" subtitles into the actual video portion
of a movie. Digital hardsubs are much like subtitled VHS tapes; the subtitles
cannot be turned off.

### Advantages of Hardsubbing

Hardsubbing is usually much less demanding on the playback device. Since the
text is already part of the video, it will only take as much processing as the
unsubtitled video would. You are also often able to make special effects that
would be difficult to replicate in a soft subtitle format, because of the large
amount of CPU usage required to renderer them. Even in softsubbed anime
fansubs, the opening and closing karaoke are often hardsubbed because of the
special effects used.

Some people argue that with hardsubs, scripts are harder to steal, since the
text is embedded in the image - thieves cannot simply extract subtitles as in a
softsub. However, the presence of very good subtitle extractors designed for
the purpose of extracting this embedded text removes much of the argument that
hardsubs prevent script stealing.

Many playback devices and computer platforms cannot display the special fonts
and formattings that softsubs contain, but this problem is removed with
hardsubs, where the style is preserved. Also, these stylings will show back
exactly the same on any device, unlike softsubs which depend on the playback
device to properly intrepret and display the stylings.

### Disadvantages of Hardsubbing

Despite what some may call numerous advantages for hardsubbing, there are
several distinct disadvantages that should be evaluated before making a
decision.

The method of hardsubbing requires that the source video is re-encoded so the
subtitles can be written on the image. This, by the nature of lossy video
encoding, causes a reduction in video quality.

Subtitles add a sharp contrast in a video image due to their nature. This will
cause compression artifacts along the edges of the encoded subtitle, and
blurring of the subtitle. This effect is especially evident at lower bitrates.

Under typical circumstances, the inclusion of the subtitles will cause an
increase in the bitrate needed for the video to keep the same quality. This, of
course, means an increased filesize, or lower quality at the same size. The
increase in bitrate necessary is typically around 3 to 10%.

Changing the subtitles requires a re-encode of the video source, which can add
a lot of time and extra work to the release process.

## Softsubbing

Softsubbing is a method that keeps subtitles separate from the video and relies
on the playback device to combine the two when the video is being played. This
method can be best compared to subtitles on most DVDs. The subtitling can be
turned on or off as needed, and multiple languages can be supported with just
one combined media file. Unlike with a DVD though, digital softsubs are
actually text (DVD subtitles are pictures) which adds many nice features at the
cost of complexity.

### Advantages of Softsubbing

Softsubs are much clearer on display. Since they are not part of the video
image, video compression does not affect them, and with a good subtitle
renderer, they are sharp and crisp - a huge benefit to readability.

Softsubs can be smaller. Since the subtitle is just a text file, it can take up
less room because it isn't hogging video bitrate. This allows for an encoder to
either make a smaller file with the same video quality, or a same-sized file
with higher video quality.

People with vision problems have an opportunity to adjust how the subtitles look on-screen.

Without a huge impact on size, multiple languages can be supported in one video file.

If you find a subtitling mistake in a file, you can fix it without having to
re-encode the video - saving a lot of time.

### Disadvantages of Softsubbing

Softsubs add processing complexity to the video. The playback device has to
render and overlay the text before displaying the video, as a result, this
means that low-powered devices will not be able to play the video.

Since the subtitles are bundled as straight text they are very easy to extract
and use. This makes things easier on bootleggers or other script stealers. Note
that grabbing subtitles from a hardsub is very easy currently, so this argument
doesn't hold much weight.

The playback device is responsible for rendering the subtitles on screen. As a
result, they might not look the same as the subtitler intended. In some cases,
the playback device might not support the subtitle format, or might have bugs
with it.

Subtitles with effects added (usually for karaoke) take up a lot of processing
time, and may cause playback issues if the device cannot handle the processing
requirements. A solution for this is to hardsub the complex parts such as
opening and ending karaoke, and softsub the normal dialog.

## What method do I choose?

The method you should choose depends greatly on your audience. Will they have
relatively new and powerful playback devices? Will they possibly be able to
install something to play back softsubs if they don't have it? Is your
destination a digital format (Matroska, DVD, etc.) or will you be printing to
tape?

While every situation will be different, you can use some of the following
suggestions to guide you. These are based on making a digital format for
playback on a computer system.

If you want your file playable on the largest range of computers, operating
systems, smartphones, televisions, and small plastic toys, you will want to
hardsub.

If your audience will be running on a platform where your subtitle format is
well-supported, softsubs are a good idea.

If you want to have multiple subtitle languages or if some of your viewers may
not want to have subtitles enabled at all, softsubs are your only option.

If you want to speed up your release process, use softsubs. They are faster to
fix if an error is found, and allow you to release as soon as the subtitles are
done, rather than waiting a few hours for the video to be encoded.

## Softsubbing workflows

Not every video player or video format fully supports ASS subtitles, so some
care needs to be taken when creating or viewing videos using them:

### Playing back softsubs

The best video player for playing back softsubs is [mpv](https://mpv.io).
On Windows, another option is [MPC-HC](https://github.com/clsid2/mpc-hc/releases).

Additional players that support ASS subtitles are the various mpv wrappers (e.g.
mpv.net, mpc-qt, IINA, Celluloid, and Haruna), VLC, or Kodi. However, mpv
remains the most recommended player, and the other players may have worse
rendering performance in some cases.

Other players like the various built-in players for Windows, Mac, TVs,
smartphones, or web browsers may sometimes have rudimentary support for
displaying the text of subtitles but will not correctly apply all effects and
formatting.

Note that except for MPC-HC, all the mentioned players use libass for rendering
subtitles. MPC-HC, on the other hand, uses its own internal variant of VSFilter
by default (which behaves similar but not identically to the other VSFilter
versions), but can be configured to use libass or an external VSFilter version
instead.

### Fonts

When adding subtitles to a video file for distribution, care needs to be taken
to also add all the font files used in the subtitle file. You can automatically
collect all used font files using Aegisub's [Fonts
Collector](Fonts_Collector.md), but you will need to make sure to then
distribute them along with your subtitles.

To check whether all fonts for a given subtitle file are present in a video
file or directory, you can run mpv from the command line with the
`--sub-font-provider=none` option, which will make it only load the fonts
attached to the video file or contained in the same directory as the video
file, and not load any of your globally installed fonts. Then, you can watch
for incorrectly formatted lines and/or font selection error messages in the
terminal output to see if the subtitles depend on any fonts that are not
yet included with the file.

### Adding softsubs to a video container

The only file format that fully supports ASS softsubs is Matroska (MKV). Other
formats may have basic support for unstyled text subtitles and/or bitmap
subtitles, but only Matroska has full support for all of the ASS format's
styling features.

You can create an MKV file using the [MKVToolNix
GUI](https://www.bunkus.org/videotools/mkvtoolnix/) by simply dragging in your
source video as well as your subtitle file. Then, you can add all the required
font files as attachments in the attachment tab. All font attachments should be
given the MIME type `application/x-truetype-font`, even if they're actually OTF
fonts. This will allow video players to recognize them as font attachments and
provide them to the subtitle renderer during playback.

### Distributing standalone softsubs

This method can be used when you want to only distribute the subtitle file and
not the video (e.g. for file size reasons). You simply send the raw subtitle
files along with the video. The viewer then needs to load them in a player that
supports external subtitles. When using this method, you either need to make
sure you use fonts that everyone can be expected to have installed, or
distribute a separate ZIP archive with the fonts. For obvious reasons, this
method isn't recommended.

### Distributing a subtitles container

A compromise between the previous two methods is to create an MKV file that
contains *only* the subtitles and the attached fonts, and no video file. Such
files are usually given the extension `.mks` (for **M**atros**k**a
**S**ubtitles, as opposed to **M**atros**k**a **V**ideo).

This MKS file can then be distributed as a standalone file to be loaded
alongside the video by the viewer. Unlike a raw subtitles file, this will then
also load all the attached fonts automatically.

The main downside of this method is that not all players support loading MKS
files. For example, at the time of writing they work perfectly fine in mpv, but
need to be explicitly loaded as subtitle files in VLC (that is, they cannot
simply be dragged into the player like other subtitle files) and cannot be
loaded at all in MPC-HC.

## Hardsubbing with Avisynth

Many people use the Avisynth package to add filters to their video to clean up
defects, or otherwise manipulate the video image before encoding it. It is a
very flexible tool, and can be also used to add subtitles directly to the video
stream, allowing an easy and scriptable method to hardsub a video.

If you are unfamiliar with Avisynth, it is recommended that you look into it,
as it has lots of nice features and a large community contributing video
filters, allowing easy video fixes for any source. This tutorial assumes you
have some basic knowledge of Avisynth.

To allow adding subtitles to the video stream, you have two options: you can
use VSFilter (included with Aegisub, in the "csri" folder), or you can use
[AssRender](https://srsfckn.biz/assrender/), which uses libass. The following
instructions assume that you are using VSFilter.

To just add subtitles, you will want to make a simple AVS file containing the
script lines you need. Simply create a plain-text file in notepad (or your
favourite text editor) and save it with the .avs extension (beware that Windows
might be hiding your extension, and you might actually be making a .avs.txt
file). Here is an example:

```plaintext
LoadPlugin("c:\program files\aegisub\csri\vsfilter.dll")
AVISource("c:\projects\project1\video\mycoolvideo.avi")
TextSub("c:\projects\project1\subs\mainsubtitles.ass")
TextSub("c:\projects\project1\subs\endkaraoke.ass")
```

The above script will take an AVI file (mycoolvideo.avi), and then draw the
contents of two subtitle files on the video. You can then encode this video in
any program that supports AVS, such as [VirtualDub](https://www.virtualdub.org)
or x264. To do so, just open the .avs file in the program, and follow the
normal encoding procedure for it.

Keep in mind that, due to a bug in VSFilter, the path to the subtitle files
MUST be absolute.
