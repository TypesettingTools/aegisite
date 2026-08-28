---
title: Resolution and Matrix
menu:
  docs-3.5:
    parent: miscellaneous
weight: 7400
aliases:
  - /docs/3.5/Resolution_and_Matrix/
  - /docs/3.5/Resolution_and_matrix/
  - /docs/3.5/resolution_and_matrix/
  - /docs/3.5/script_resolution/
  - /docs/3.5/Script_Resolution/
---

When authoring ASS subtitles to fit a specific video, there are a couple of
settings that must be set correctly in order for the subtitles to render with
the right scaling and colors.
These parameters are the Script Resolution, the Layout Resolution, and the YCbCr Matrix.

For historical reasons, the behavior of these parameters can be somewhat
confusing. This page explains the meaning and effect of each parameter in
detail, and gives instructions on how to set or adjust these parameters in all
of the common cases you may encounter.

If you are not interested in the theory, the [examples]({{< relref "#examples" >}}) section
should cover the vast majority of cases you're likely to run into in the wild.

## Script Resolution
The Script Resolution controls the coordinate system used by almost all
coordinates and sizes in ASS subtitles. This includes:

- Font sizes
- Margins
- Positions
- Border widths and shadow offsets
  (if "Scale Border and Shadow" is enabled, which it should always be)
- Clip coordinates
- Vector drawing coordinates

For example, on a Script Resolution of 2000×1000:

- Text with a font size of 100 (and no additional scaling) will take up 10
  percent of the screen's height.
  (More accurately: With a font size of 100, a line break will result in the
  second line being 10 percent of the screen's height below the first.)
- A vertical margin of 100 will take up 10 percent of the screen's height.
- A `\pos(1000,500)` tag will position a line in the middle of the screen.
- A `\clip(0,0,1000,1000)` will cover the left half of the screen.
- A drawing `{\pos(1000,0)\an7\p1}m 0 0 l 0 1000 1000 1000 1000 0`
  will cover the right half of the screen.

This happens independently of the resolution of the video the subtitles are
displayed on, or of the size of the player window.

When you are creating a new subtitle file, it is hence easiest to set its
Script Resolution to the resolution of the video you are authoring them for, so
that font sizes and coordinates will correspond directly to pixels.
By default, Aegisub will do this automatically when opening a video for the
first time on a new subtitle file.

However, there is no inherent requirement for the Script Resolution to match
the video's resolution, as long as the aspect ratios match.
For example, if your video has a resolution of 1920×1080, you can set the
Script Resolution to 1920×1080, but you could just as well set it to 1280×720
(but not 1440×1080), if you prefer.
This will result in font sizes and coordinates scaling differently (i.e. a font
size of 100 looks larger on a Script Resolution of 1280×720 than on 1920×1080),
but other than that everything will work the same.

In particular, when you are opening some existing subtitle file with a Script Resolution
of 1280×720 and want to edit it on a 1920×1080 video, you can just leave its Script Resolution
as it is.
There is no need to change it or resample the script.

When you are authoring subtitles on an *anamorphic* video (a video whose pixels
aren't square, meaning that the player needs to stretch or squash the stored
video before displaying it) like e.g. from a DVD, it is recommended to set the
Script Resolution to the *display* resolution of your video.
For example, for a video that is stored with a resolution of 720×480 but has a
pixel aspect ratio of 10:11, resulting in media players stretching it to 720×528
after decoding, you should set the Script Resolution to 720×528.
This will ensure that, for example, square clips and drawings are displayed as
actual squares instead of being stretched or squished.

## Layout Resolution

As explained above, most values in ASS subtitles are expressed relative to
the Script Resolution.
However, there are a handful of values that do *not* behave this way.
This is mainly due to historical reasons, i.e. due to oversights in the initial
implementation of these features that could not be fixed afterwards without
breaking backwards compatibility.

These values are:

- `\blur` strengths
- The focal length used for three-dimensional rotations (`\frx` and `\fry`)
- Text widths (which scale correctly when proportionally scaling the player or
  video, but not when stretching anamorphically).

In the past, this meant that the same subtitle file could render in different
ways depending on the resolution of the video it was played on, which made it
very hard to create portable subtitle files.

The Layout Resolution fields were introduced to address this issue without
breaking backwards compatibility with existing subtitle files.
If a script's Layout Resolution is set, it will be used to properly scale these
three values to any target resolution (anamorphic or not), so that the subtitle
files will render the same way on any video resolution (including anamorphic
ones) and player window size.

Hence, the most important part of using Layout Resolution is to make sure that

1. It is set at all.
2. Its aspect ratio matches the aspect ratio of the Script Resolution (which
   should in turn ideally match the (display) aspect ratio of the video).

As explained above, the first point ensures that your subtitles will render
the same way on any video resolution.
The second point is recommended so that text is not horizontally stretched or squished:
If the Layout Resolution has the same aspect ratio as the Script Resolution,
text will be drawn proportionally (in the Script Resolution's coordinate system).
For example, a lowercase `o` will look approximately like a circle.
On the other hand, if one was to use a Script Resolution of 2000×1000 and a
Layout Resolution of 1000×1000, then all text would be horizontally stretched
by a factor of two
(assuming the player window's aspect ratio matches the Script Resolution's, which should
be the case if the Script Resolution was set to match the video's display resolution).
Moreover, any `\blur` would be stronger in the horizontal direction than in the
vertical one.
This is why it is better for the Layout Resolution's aspect ratio to match the
Script Resolution's.

When you are creating a new subtitle file, the advice is hence very similar to
the advice for the Script Resolution:
The simplest method is to set both Script Resolution and Layout Resolution to the
display resolution of the video you are planning to author the subtitles for.
Aegisub will offer to do this automatically when opening a video on a subtitle file
that does not yet have a Layout Resolution set.

When you are modifying an existing subtitle file that already has a Layout
Resolution set, then you usually do not need to change its Script or Layout
Resolution in any way, even if they differ from the resolution of the video you
are planning to apply your subtitles to.
The only exception here is if your video is a cropped version of the original
one or vice-versa; for this case refer to the section on
[adapting subtitles to new videos]({{< relref "#step-3-apply-to-your-new-video" >}})
below.

When you are modifying an existing subtitle file that does *not* already have
a Layout Resolution set, refer to the section on
[adapting subtitles to new videos]({{< relref "#step-3-apply-to-your-new-video" >}}).

Finally, note that the "blur strength" item above *only* applies to `\blur` tags
and not to `\be`.
`\be` is the one override tag that does not scale *at all* to different video or
player window resolutions, neither relative to the Script Resolution nor
relative to the Layout Resolution.
This means that it is impossible to make it display consistently on different resolutions.
This (as well as the fact that it gets slower and slower for larger blurs)
is why it is recommended to never use `\be`.

### Exact Layout Resolution Math

This subsection explains the scaling of Layout Resolution in more detail.
As a normal user, you probably do not need to know this and can skip this part,
but it is here if you are interested.

The first value that scales with the Layout Resolution is the `\blur` strength.
This happens for both axes individually.
More precisely, this means the following: To obtain the vertical blur strength
in the Script Resolution's coordinate system, the blur strength is multiplied
by the quotient of the Script Resolution's height by the Layout Resolution's height.
Similarly, the horizontal blur strength is obtained by multiplying the blur strength
by the quotient of the Script Resolution's width by the Layout Resolution's width.
If the aspect ratio of the Layout Resolution does not match that of the Script Resolution,
this means that the blur will have different strengths along the two axes in Script Resolution units.

The second value is the focal length for three-dimensional rotations.
This is a fixed value of 312.5 (arising as 20,000 / 64) relative to the
Layout Resolution's height.
That is, it is given in Script Resolution units as 312.5 multiplied by the quotient of the
Script Resolution's height by the Layout Resolution's height.

Unlike all of the other values, this focal length is not one that can be directly set
via an override tag, so it is not possible to change a subtitle file's Layout Resolution
and then adjust the focal lengths to match.
This means that a subtitle file containing three-dimensional rotations must keep its vertical
Layout Resolution in order for the rotations to keep looking correct.
If a subtitle file does not contain any three-dimensional rotations, it is in theory possible
to replace its Layout Resolution with a different one (but with the same aspect ratio)
and adjust all tag values to match (though there's no real reason why you would ever want to),
but as soon as the file contains three-dimensional rotations, this is no longer possible
(at least not without recalculating all perspectives from scratch, which might require
splitting certain events into frame-by-frame sections and/or separate events for each style run).

Finally, there is the horizontal text scaling.
The font size itself is given in Script Resolution units, but the text is
horizontally scaled in such a way that it is scaled proportionally in
Layout Resolution units.
That is, the horizontal text scaling (in the Script Resolution coordinate system)
is multiplied by the quotient of the Script Resolution's aspect ratio by the
Layout Resolution's aspect ratio:
If the two resolutions are equal, text is proportional (assuming no other `\fscx` or `\fscy` scaling).
If, for example, the Script Resolution is 2000×1000 while the Layout Resolution is 1000×1000,
the text is twice as wide as usual while having the same height.

Thus, a change in the Layout Resolution's aspect ratio can be compensated by
multiplying all `\fscx` values with the resulting factor, but this would of
course affect blur and the focal length.

After these scaling computations, all coordinates and sizes are now given in Script Resolution units.
From there, they are converted to Frame Resolution (i.e. the resolution of the player window, or
whatever other resolution the player actually renders the subtitles at) units by simply proportionally
scaling all of them together.
Changing the size of the player window will simply result in the rendered subtitles being stretched
or squashed proportionally, with all of their relative positioning and scaling remaining the same,
even if their aspect ratio changes.

## YCbCr Matrix

Colors in ASS subtitles are specified as RGB triples.
(Except that they are actually ordered as BGR, but that does not really matter here.)
However, most encoded videos store colors in a different format called YCbCr.

Colors can be converted from RGB to YCbCr and back by multiplying them with a
certain matrix (and adding some constant summands).
Media players will do this automatically when playing back a video file.

Now, some subtitle renderers, in particular the original VSFilters, blend the subtitles
directly onto the YCbCr encoded video stream (as opposed to rendering them onto the decoded
RGB output right before it is displayed to the viewer).
This means that they need to convert the RGB colors specified in styles and override tags
to YCbCr before they can be blended onto the video.

The problem, now, is that there are multiple distinct YCbCr encodings for colors,
and hence that there are multiple different ways to convert an RGB color to YCbCr and back.

Each method for converting RGB colors to YCbCr is specified by a color matrix
together with a color range.
The two possible color ranges are "Limited Range" (also called "MPEG Range" or
"TV Range") and "Full Range" (also called "JPEG Range" or "PC Range").
Almost every video you will come across will use Limited Range.
For the color matrix there is a larger number of possible values, but the two
matrices that are mainly relevant when working with ASS subtitles are BT.601
and BT.709.

Out of these two matrices, BT.601 (also called SMPTE ST 170M) is the older one.
It was used for old SD-era content like DVDs.
BT.709, on the other hand, is the newer matrix.
The vast majority of modern videos you will run into (say, movies and TV shows
that were produced in 720p or higher, screen captures, most YouTube videos, etc.)
will usually be BT.709 unless they use HDR colors.

For well-behaved video files, the color matrix and range that are supposed
to be used to convert its YCbCr colors back to RGB will be specified ("tagged")
somewhere in the video's metadata, so that video players will know how to correctly
interpret its colors.
However, there are also many video files that do not contain this metadata
(i.e. are "untagged"), meaning that video players will have to guess their
matrix and range based on its resolution.
For such files, there is hence no guarantee that the same file will render
with the same colors in different players (or even different versions of the same player).

You can see the matrix and range a video is tagged with by opening it in Aegisub
and checking the "Original Video Matrix" and "Original Video Range" in the
"Show Video Details" dialog in the Video menu.
When Aegisub opens a file whose color matrix is not tagged, it will show a warning,
since this will make it harder to match the video's colors using subtitles.
If you encounter such a file, it is recommended to add color matrix and range
metadata to it yourself.
See below for one way to do this.

The issue that makes this topic relevant for subtitling is that not all subtitle
renderers have access to the color matrix and range the video is tagged with.
Even worse, the original VSFilters were hardcoded to using a BT.601 matrix
for converting the RGB colors to YCbCr, even if the video was actually using BT.709.
This meant that an RGB color specified in a subtitle file would actually render
as a different RGB color after it was blended onto the video and shown in a media player,
which made it hard or impossible to match video colors with subtitles.

To fix this issue, the YCbCr Matrix header was introduced.
This property of an ASS file will tell the subtitle renderer what color matrix and range
it should use to convert the subtitle file's RGB colors to YCbCr.
Its current valid values are:

- `TV.601`, `TV.709`, `TV.FCC`, `TV.240M` for the BT.601, BT.709, FCC, and
  SMPTE ST 240M matrices respectively, with limited range.
- `PC.601`, `PC.709`, `PC.FCC`, `PC.240M` for the same matrices, but with full range.
- `None`, to signal that the subtitles should use the video's color matrix and range, if available.

If the header has no value or is missing, this is interpreted as the value
`TV.601` for backwards compatibility with old subtitle files.

The YCbCr Matrix is also relevant when the subtitle renderer does its blending
in RGB rather than YCbCr:
To be compatible with the reference implementation that blends in YCbCr,
such renderers or players will convert the subtitle file's RGB colors
to YCbCr using the file's YCbCr Matrix, and then convert them back to RGB using
the video's tagged (or guessed) color matrix and range before blending in RGB.
(If the matrices match or the YCbCr Matrix header is `None`, it can skip this
process and use the RGB colors directly.)

With all of this theory and history now explained, this means the following for authoring subtitles:

When creating a new subtitle file to be applied to a certain video file,
the YCbCr Matrix header of the subtitle file should be set to a value
matching the color matrix and range of the video file, or to `None`.
(So, in particular, you should ensure that the video file is indeed tagged with
a matrix and range).

The differences and trade-offs between an explicit YCbCr Matrix and a value of `None`
are a bit subtle.
The advantage of `None` over an explicit matrix is that it will make the subtitle file
work on multiple videos with the same underlying RGB colors that were encoded
with different matrices or ranges.
In exchange, the disadvantage is that it is less reliable if the video is
untagged or incorrectly tagged.
Moreover, there currently are various implementation quirks with some of these
settings in various players.
For best results across all relevant players, the recommendation is the following:

- Ensure that the video is tagged with its correct color matrix and range.
- If the video's color matrix is BT.601 or BT.709, set the YCbCr Matrix header to
  the corresponding matrix and range.
- Otherwise, set the YCbCr Matrix to `None`.

As with the other parameters, Aegisub will offer to do this automatically when
opening a video on a subtitle file that does not yet have a YCbCr Matrix set.

To make visual typesetting easier, Aegisub will not actually perform the color
mangling process described above when rendering its subtitles.
Instead, it will force the video's YCbCr colors to be converted to RGB using the
*subtitle file*'s tagged YCbCr Matrix header rather than the video's tagged matrix
and range, and then blend the subtitle file's RGB colors onto it directly.
If the YCbCr Matrix header differs from the video's color matrix and range,
this will mean that Aegisub will display the video with different colors than
a video player will, but in exchange it will be possible to match subtitle colors
to the video using the screen color picker.

### HDR

At the time of writing, it is not possible to create portable ASS subtitles that
match video colors on HDR or WCG video.
When you are hardsubbing video using a workflow you yourself control, you can of
course use any fixed colorimetry setup you want (For example, you can simply pretend
that your video uses some different color space and match video colors using that.
But note that even then, you will only be able to use 8 bits of color depth in subtitles),
but you will not be able to create softsubs that reliably work in a video player.

It is still possible to create normal subtitles for spoken dialogue, but it will
not be possible to, for example, mask on-screen elements using drawings with matching colors.

By default, Aegisub will show a warning when opening an HDR video.

### Primaries and transfer

Readers that already have experience in digital color may wonder how the primaries
and transfer characteristics fit into this picture.
The short answer is that they do not really matter.
The more detailed answer is that the reference implementation of ASS rendering
blends subtitles directly onto the YCbCr frames after converting the RGB colors
in the subtitles to YCbCr using the provided matrix and range.
Hence, the primaries and transfer characteristics of the video do not affect this
process in any way.

If one wanted to assign some sort of color space to the RGB colors specified in
ASS subtitle files, it would thus be the most accurate to say that colors in
ASS subtitles use the same primaries, white point, and transfer characteristics
as the video they are applied to uses.

Note, however, that video players may purposefully diverge from this behavior
when playing subtitles on HDR video: ASS rendering was not designed with HDR
video in mind, and color matching is not possible there anyway, so this is a
sensible choice to at least make dialogue subtitles work well on HDR video.

## Adapting existing files

The above sections explained the theory behind the resolution and matrix
parameters in detail.
As explained there, in most simple cases (like when creating a new subtitle
file on some fixed video file), you do not need to worry about these parameters
and can simply let Aegisub set them to their suggested values.
The cases where you actually have to worry about how to set these parameters
are mainly the ones where you have some old subtitle file that was originally
authored for one video file, and now want to adapt it to a different video.

There are a lot of different cases here, but the large-scale process is always the same.

##### Step 1: Ensure that the subtitles look correct on their original video

First of all, completely forget about your new video file for a moment and, if possible,
find the video that the subtitles were originally meant to be applied to.
Then, ensure that they look correct when played with that video in one of the
[recommended video players]({{< relref "Attaching_subtitles_to_video.md" >}}).
In particular, check that:

- Text looks proportional
- Translations of on-screen text (if present) correctly line up with the video
- Blur strengths look roughly correct
- Three-dimensional rotations (if present) look correct
- Elements that are supposed to match colors in the video do correctly match these colors

Hopefully, this will all be the case, in which case you can move on to Step 2a.
If not, or if you cannot find the original video file, refer to Step 2b.

##### Step 2a: Set script parameters

Next, set the file's Layout Resolution and YCbCr Matrix headers if they are not set already.
If either of these parameters is already set, do not touch them.
If the YCbCr Matrix is not set, set it to `TV.601`.
If the Layout Resolution is not set, set it to the *storage* resolution of the original video.
Then, check again that everything still renders correctly on the original video.

##### Step 2b: Guessing script parameters

If you do not have access to the original video file, or if the subtitle file
somehow looks incorrect on the original video (maybe because it was authored to
target some old player version or was already incorrectly resampled once), you
will need to do some trial and error until you find the right parameters to set.
For the YCbCr Matrix, you can try both `TV.601` and `TV.709`.
For the Layout Resolution, there are a handful of values you can try:

- The original video's storage resolution
- The original video's display resolution
- The file's Script Resolution
- The file's Script Resolution, scaled by the original video's pixel aspect ratio

##### Step 3: Apply to your new video

Only now should you apply the subtitles to your new video file.
If the new video is some scaled version of the original video
(e.g. resized from 1280×720 to 1920×1080 or anamorphically resized from 720×528
to 720×480), then you do not need to change the Layout Resolution any further.
You can simply apply the edited subtitles to your new video file
(or any other scaled version of the video)
and not touch these properties any further.

The one case where you still need to adjust your file is if your new video file
is a cropped version of the original video or vice-versa.
For example, if your original video was a 4:3 video encoded in 1920×1080
with black bars included in the video, and your new video is a 1440×1080
encode without any black bars, then you will need to adjust the subtitles accordingly.
You can do this using Aegisub's [Resolution Resampler]({{< relref "Resolution_Resampler.md" >}}):
Open your updated subtitle file in Aegisub together with the new video.
(This will probably result in the subtitles not looking correct for the time being,
but that's fine.)
Then, open the Resolution Resampler and select "Remove borders" or "Add borders", depending
on whether the new or the original video is the cropped one, and click "OK".

For the YCbCr Matrix this is a bit more subtle.
Here, there are essentially three cases.

###### Case 1: No difference in colors or color space

The simplest case is when the old and new video file use exactly the same color
matrix and range, as well as the same encoded color values (which also means
that their colors will look the same in a video player).
In this case, you can simply leave the YCbCr Matrix unchanged.

###### Case 2: Reencode with different matrix

The second case is when the new video is a new encode of the same underlying
RGB content, but using a different color matrix or range for the YCbCr
conversion.
This can happen when moving from a DVD encode to a Blu-ray encode.
In this case, the colors of the two videos should still look the same in a video player,
but their tagged color matrices may differ.

In this case, you should *set* the YCbCr Matrix of the subtitles to the matrix
and range of your new video (or to `None`; see the recommendation above) and
leave the color values in styles and tags unchanged.

###### Case 3: Retagged video

The third case is when the old video was either tagged with an incorrect matrix,
or untagged in a way where video players would guess the wrong matrix, and the new video
uses the same encoded YCbCr colors, but now with the correct tagged matrix.
This means that the colors of the two videos will *not* look the same when
played in a video player.

In this case, the YCbCr Matrix should *not* be replaced with the new video's matrix.
However, if you want to then work on this subtitle file with this video further,
it would be best to resample the file to the new YCbCr Matrix using Aegisub's
[Resolution Resampler]({{< relref "Resolution_Resampler.md" >}}) (leaving the resolution unchanged).

## Examples

Finally, here are a few concrete examples to show how you should set these
properties in most common cases.

##### Example 1: Starting a new subtitle file on a 1920×1080 video

It is recommended to set both the Script Resolution and Layout Resolution to 1920×1080.
The YCbCr Matrix should most likely be set to `TV.709`, but make sure to double-check
the color matrix and range that your video actually uses.

##### Example 2: Starting a new subtitle file on an anamorphic DVD video

For example, let's assume that your video is stored with a resolution of
720×480 but has a pixel aspect ratio of 10:11, resulting in media players
stretching it to 720×528 after decoding.
In this case, you should set both the Script Resolution and Layout Resolution
to 720×528.

The YCbCr Matrix should most likely be set to `TV.601`, but make sure to double-check
the color matrix and range that your video actually uses.

##### Example 3: Adapting a file from a 1280×720 video to 1920×1080

Say you have a subtitle file with a Script Resolution of 1280×720 that was intended
to be played on a 1280×720 video and want to now apply it to a 1920×1080 video.

If the video does not yet have a Layout Resolution set, you should set it to 1280×720.
(If it already has one set, do not change it any further.)

If the original video and subtitle file already used a BT.709 color matrix,
you do not need to change the YCbCr Matrix either.
If the original video or subtitle file used a different matrix, refer to
[cases 2 and 3]({{< relref "#case-2-reencode-with-different-matrix" >}})
for adjusting the YCbCr Matrix above for how to proceed.

##### Example 4: Adapting a file from a 1920×1080 4:3 video with black bars to a cropped 1440×1080 video

Say you have a subtitle file that is designed to be played on a 4:3 video that
is encoded in 1920×1080 with black bars encoded into the video, and now want to
apply it to a cropped (1440×1080) version of the same video.

In this case, you should

1. Set the Layout Resolution of the subtitle file to 1920×1080 if it is not yet
   set, or leave it unchanged if it is already set
2. Run Aegisub's Resolution Resampler to resample the resolution to 1440×1080
   in "Remove borders" mode.

## FAQ

### My subtitle file's resolution differs from the video's. Do I need to change it?

If everything looks the way it should, there is no need to do anything.
If something looks off, refer to the above sections for how to diagnose and fix it.

If your Script Resolution's aspect ratio differs from the video's,
you may want to resample it (in "Stretch" mode) to match the aspect ratio,
but note that this will change the rendering of any elements that use
blur or three-dimensional rotations.
If your file does not contain any such elements, it is fine to resample.
If it does contain such elements, and you do not want to recreate them,
it is perfectly fine to keep the resolution as it is.

If you prefer for the positions and sizes in your subtitles to match the video's resolution,
you can resample the Script Resolution using Aegisub's Resolution Resampler.
Note, however, that

1. This is not required.
1. Losslessly resampling is only possible when the aspect ratio does not change.
1. This will not affect blur strengths, so these will not be able to be expressed
   relative to the video's resolution.

### My subtitle file's YCbCr Matrix differs from the video's. Do I need to change it?

If you plan to continue working on your subtitles with this video file, you
should probably adjust it to match your video's matrix.
However, how this should be done (whether the YCbCr Matrix should simply be changed
or whether it should be resampled) depends on your specific case.
For more information, check [cases 2 and 3]({{< relref "#case-2-reencode-with-different-matrix" >}})
for adjusting the YCbCr Matrix above.

### Tagging a video's color space

One way to add color space information to a video is using
[MKVToolNix](https://www.bunkus.org/videotools/mkvtoolnix/).
Open the MKVToolNix GUI and drag the video into it.
Then, select the video track in the track list and type in the numbers
corresponding to the correct color matrix (under "Color matrix coefficients")
and color range in the "Color information" section on the right.
You can check which number corresponds to which matrix or range in the
[MKVToolNix manual](https://mkvtoolnix.download/doc/mkvmerge.html#mkvmerge.description.color_matrix_coefficients).
