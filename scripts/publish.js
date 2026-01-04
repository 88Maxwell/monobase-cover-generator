import ghpages from "gh-pages";
import path from "path";

const buildPath = path.resolve("dist");

ghpages.publish(buildPath, (err) => {
  if (err) {
    console.error("Publish error:", err);
  } else {
    console.log("Site published successfully!");
  }
});
