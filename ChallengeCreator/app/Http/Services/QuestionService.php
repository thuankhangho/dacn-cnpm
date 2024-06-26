<?php

namespace App\Http\Services;

use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\LazyCollection;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\HTTPService;
use Illuminate\Contracts\Config\Repository as ConfigContract;

class QuestionService implements BaseCrudServiceInterface
{
    private string $apiKey;

    public function __construct(private HTTPService $apiClient, ConfigContract $config)
    {
        $this->apiClient->setBaseUrl($config->get('aiclient.base_url'));
        $this->apiKey = $config->get('aiclient.client_secret');
    }

    /**
     * Generate questions
     *
     * @param array $rq
     * @param string $qbID, $label_id
     *
     * @return Collection
     *
     * @link https://localhost:3000/genqa
     */
    public function AIgenerate(array $request, $qbID, $label_id): Collection
    {
        $response = $this->apiClient->
        setContentType(HttpService::CONTENT_TYPE_JSON)
        ->post('/genqa', $request);
        $data =  $response->getData();

        if (!$response->isSuccessful()) {
            abort(403,"Failed to reach API" . env('AI_CLIENT_URL'));
        }
        $questions = new Collection();
        foreach ($data as $question) {
            $questions[] = new Question([
                "question" => $question["question"],
                "ans1" => $question["ans1"],
                "ans2" => $question["ans2"],
                "ans3" => $question["ans3"],
                "ans4" => $question["ans4"],
                "ans5" => $question["ans5"],
                "ans6" => $question["ans6"],
                "question_bank_id" => $qbID,
                "correct" => 1,
                "label_id" => $label_id
            ]);
        }
        return $questions;
    }

    /**
     * Get filtered results
     *
     * @param array $search
     * @param int $pageSize
     * @return LengthAwarePaginator
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */

    public function getAllPaginated(array $search = [], int $pageSize = 15): LengthAwarePaginator
    {
        // dd(Question::filter($search)->toSql());
        return Question::filter($search)->paginateFilter($pageSize);
    }

    /**
     * Get all records as collection
     *
     * @param array $search
     * @return EloquentCollection
     */
    public function getAll(array $search = []): EloquentCollection
    {
        return Question::filter($search)->get();
        // return $this->repository->getAll($search);
    }

    /**
     * Get results count
     *
     * @throws RepositoryException
     */
    public function count(array $search = []): int
    {
        return Question::filter($search)->count();
        // return $this->repository->count($search);
    }

    /**
     * Find or fail the model
     *
     * @param $key
     * @param string|null $column
     * @return Model
     */
    public function findOrFail($key, string $column = null): Model
    {
        $search = [
            $column => $key
        ];
        return Question::filter($search)->first();
    }

    /**
     * Find models by attributes
     *
     * @param array $attributes
     * @return Collection
     */
    public function find(array $attributes): Collection
    {
        return Question::filter($attributes)->get();
    }

    /**
     * Create model
     *
     * @param array $data
     * @return Model|null
     * @throws ServiceException
     */
    public function create(array $data): ?Model
    {
        $model = resolve(Question::class);
        $saved = $model->fill($data)->save();

        if (!$saved) {
            return null;
        }
        if (!is_array($model->getKey())) {
            return $model->refresh();
        }

        return $model;
    }

    /**
     * Insert data into db
     *
     * @param array $data
     * @return bool
     */
    public function insert(array $data): bool
    {
        $qb = new Question();
        $qb -> question = $data["question"];
        $qb -> ans1 = $data["ans1"];
        $qb -> ans2 = $data["ans2"];
        $qb -> ans3 = $data["ans3"];
        $qb -> ans4 = $data["ans4"];
        $qb -> ans5 = $data["ans5"];
        $qb -> ans6 = $data["ans6"];
        $qb -> correct = $data["correct"];
        $qb -> question_bank_id = $data["question_bank_id"];
        $qb -> label_id = $data["label_id"];
        $saved = $qb->save();
        return $saved;
    }

    /**
     * Create many models
     *
     * @param array $attributes
     * @return Collection
     * @throws ServiceException
     */
    public function createMany(array $attributes): Collection
    {
        if (empty($attributes)) {
            throw new Exception('Data is empty');
        }

        return DB::transaction(function () use ($attributes) {
            $models = collect();

            foreach ($attributes as $data) {
                $models->push($this->create($data));
            }

            return $models;
        });
    }

    /**
     * Update or create model
     *
     * @param array $attributes
     * @param array $data
     * @return Model|null
     * @throws ServiceException
     */
    public function updateOrCreate(array $attributes, array $data): ?Model
    {
        if (is_null($model = Question::updateOrCreate($attributes, $data))) {
            throw new Exception('Error while creating or updating the model');
        }

        return $model;
    }

    /**
     * Update model
     *
     * @param $keyOrModel
     * @param array $data
     * @return Model|null
     */
    public function update($keyOrModel, array $data): ?Model
    {
        $qb = Question::find($keyOrModel);
        $qb -> update($data);
        $qb -> save();
        return $qb;
    }

    /**
     * Delete model
     *
     * @param $keyOrModel
     * @return bool
     * @throws Exception
     */
    public function delete($keyOrModel): bool
    {
        if (is_int($keyOrModel)) {
            return Question::where("id",$keyOrModel)->delete();
        }
        return $keyOrModel->delete();
    }

    /**
     * Delete many records
     *
     * @param array $keysOrModels
     * @return void
     */
    public function deleteMany(array $keysOrModels): void
    {
        DB::transaction(function () use ($keysOrModels) {
            foreach ($keysOrModels as $keyOrModel) {
                $this->delete($keyOrModel);
            }
        });
    }
}
