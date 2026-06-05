# NAUSYS API Setup

Add these environment variables in Vercel:

`NAUSYS_USERNAME`

Your NAUSYS agency API username.

`NAUSYS_PASSWORD`

Your NAUSYS agency API password.

Optional:

`NAUSYS_RESULTS_PER_PAGE`

How many live yachts to show per search. Default is `12`.

`NAUSYS_REGION_IDS_BY_KEY`

Optional JSON mapping if you want exact NAUSYS region filtering later. Example:

```json
{
  "greece-ionian": [123456],
  "greece-saronic": [234567],
  "croatia-dalmatia": [345678]
}
```

After adding or changing environment variables, redeploy the project in Vercel.
